/**
 * Analyze a V8 heap snapshot to find what retains vm context globals.
 *
 * Looks for objects of type "Context" or with specific patterns
 * that indicate vm context retention.
 */
import { readFileSync } from 'node:fs';

const SNAPSHOT_PATH = '/tmp/lazy-dom-suite60.heapsnapshot';

console.log('Loading heap snapshot (this may take a moment)...');
const raw = readFileSync(SNAPSHOT_PATH, 'utf8');
console.log('Parsing JSON...');
const snapshot = JSON.parse(raw);
console.log('Done parsing.');

const { nodes, edges, strings, snapshot: meta } = snapshot;
const nodeFields = meta.node_fields;
const edgeFields = meta.edge_fields;

const NODE_FIELD_COUNT = nodeFields.length;
const EDGE_FIELD_COUNT = edgeFields.length;

// Node field indices
const NODE_TYPE_IDX = nodeFields.indexOf('type');
const NODE_NAME_IDX = nodeFields.indexOf('name');
const NODE_ID_IDX = nodeFields.indexOf('id');
const NODE_SELF_SIZE_IDX = nodeFields.indexOf('self_size');
const NODE_EDGE_COUNT_IDX = nodeFields.indexOf('edge_count');

// Edge field indices
const EDGE_TYPE_IDX = edgeFields.indexOf('type');
const EDGE_NAME_IDX = edgeFields.indexOf('name_or_index');
const EDGE_TO_IDX = edgeFields.indexOf('to_node');

// Node types
const nodeTypes = meta.node_types[0];
// Edge types
const edgeTypes = meta.edge_types[0];

console.log(`Node fields: ${nodeFields.join(', ')}`);
console.log(`Edge fields: ${edgeFields.join(', ')}`);
console.log(`Node types: ${nodeTypes.join(', ')}`);
console.log(`Edge types: ${edgeTypes.join(', ')}`);
console.log(`Total nodes: ${nodes.length / NODE_FIELD_COUNT}`);
console.log(`Total edges: ${edges.length / EDGE_FIELD_COUNT}`);

// Find all nodes and their types
const totalNodes = nodes.length / NODE_FIELD_COUNT;

// Count node types
const typeCount = {};
for (let i = 0; i < totalNodes; i++) {
  const offset = i * NODE_FIELD_COUNT;
  const typeIdx = nodes[offset + NODE_TYPE_IDX];
  const typeName = nodeTypes[typeIdx];
  typeCount[typeName] = (typeCount[typeName] || 0) + 1;
}
console.log('\nNode type counts:');
for (const [type, count] of Object.entries(typeCount).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

// Find "system / Context" nodes (V8 internal context objects)
console.log('\n=== Looking for V8 Context/NativeContext objects ===');
const contextNodes = [];
for (let i = 0; i < totalNodes; i++) {
  const offset = i * NODE_FIELD_COUNT;
  const nameIdx = nodes[offset + NODE_NAME_IDX];
  const name = strings[nameIdx];
  if (name === 'system / Context' || name === 'system / NativeContext' ||
      name === 'InternalNode' || name.includes('Context')) {
    const typeIdx = nodes[offset + NODE_TYPE_IDX];
    const selfSize = nodes[offset + NODE_SELF_SIZE_IDX];
    if (selfSize > 10000) {  // Only show large contexts
      contextNodes.push({
        index: i,
        name,
        type: nodeTypes[typeIdx],
        selfSize,
        id: nodes[offset + NODE_ID_IDX],
      });
    }
  }
}

console.log(`Found ${contextNodes.length} large context-like nodes (>10KB self size)`);
for (const ctx of contextNodes.slice(0, 20)) {
  console.log(`  [${ctx.index}] ${ctx.name} type=${ctx.type} selfSize=${Math.round(ctx.selfSize/1024)}KB id=${ctx.id}`);
}

// Find objects with large retained sizes - look for patterns
// Find the global objects (type="object", name="global" or "Window")
console.log('\n=== Looking for global/Window objects ===');
const globalNodes = [];
for (let i = 0; i < totalNodes; i++) {
  const offset = i * NODE_FIELD_COUNT;
  const nameIdx = nodes[offset + NODE_NAME_IDX];
  const name = strings[nameIdx];
  if (name === 'global' || name === 'Window' || name === 'Global') {
    const typeIdx = nodes[offset + NODE_TYPE_IDX];
    const selfSize = nodes[offset + NODE_SELF_SIZE_IDX];
    globalNodes.push({
      index: i,
      name,
      type: nodeTypes[typeIdx],
      selfSize,
      id: nodes[offset + NODE_ID_IDX],
    });
  }
}
console.log(`Found ${globalNodes.length} global/Window nodes`);
for (const g of globalNodes.slice(0, 30)) {
  console.log(`  [${g.index}] ${g.name} type=${g.type} selfSize=${Math.round(g.selfSize/1024)}KB id=${g.id}`);
}

// Find what RETAINS these global objects (who has edges pointing to them)
console.log('\n=== Finding retainers of global objects ===');

// Build a reverse edge map: to_node_index -> [(from_node_index, edge_name)]
// This is expensive for 1.4GB snapshots so let's just do it for the target nodes
const targetNodeIndices = new Set(globalNodes.map(g => g.index));

// Walk all edges to find which nodes point to our targets
let edgeOffset = 0;
const retainers = new Map(); // target_index -> [{from_index, edge_name, edge_type}]

for (let nodeIdx = 0; nodeIdx < totalNodes; nodeIdx++) {
  const nodeOffset = nodeIdx * NODE_FIELD_COUNT;
  const edgeCount = nodes[nodeOffset + NODE_EDGE_COUNT_IDX];

  for (let e = 0; e < edgeCount; e++) {
    const eOff = (edgeOffset + e) * EDGE_FIELD_COUNT;
    const toNodeOffset = edges[eOff + EDGE_TO_IDX];
    const toNodeIdx = toNodeOffset / NODE_FIELD_COUNT;

    if (targetNodeIndices.has(toNodeIdx)) {
      const edgeTypeIdx = edges[eOff + EDGE_TYPE_IDX];
      const edgeNameIdx = edges[eOff + EDGE_NAME_IDX];
      const edgeType = edgeTypes[edgeTypeIdx];
      const edgeName = edgeType === 'element' ? `[${edgeNameIdx}]` : strings[edgeNameIdx];

      const fromNameIdx = nodes[nodeOffset + NODE_NAME_IDX];
      const fromName = strings[fromNameIdx];
      const fromTypeIdx = nodes[nodeOffset + NODE_TYPE_IDX];
      const fromType = nodeTypes[fromTypeIdx];

      if (!retainers.has(toNodeIdx)) retainers.set(toNodeIdx, []);
      retainers.get(toNodeIdx).push({
        fromIndex: nodeIdx,
        fromName,
        fromType,
        edgeName,
        edgeType,
      });
    }
  }

  edgeOffset += edgeCount;
}

for (const g of globalNodes.slice(0, 10)) {
  const rets = retainers.get(g.index) || [];
  console.log(`\n  global [${g.index}] id=${g.id} retained by ${rets.length} refs:`);
  for (const r of rets.slice(0, 10)) {
    console.log(`    <- ${r.fromType}:${r.fromName} via .${r.edgeName} (${r.edgeType})`);
  }
}
