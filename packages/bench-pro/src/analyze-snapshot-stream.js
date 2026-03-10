#!/usr/bin/env node
/**
 * Streaming heap snapshot analyzer.
 * Processes V8 heap snapshots without loading the entire file into memory.
 *
 * Usage: node analyze-snapshot-stream.js <snapshot.heapsnapshot> [top-N]
 */
const fs = require("fs");
const readline = require("readline");

const snapshotPath = process.argv[2];
const topN = parseInt(process.argv[3] || "50");

if (!snapshotPath) {
  console.error("Usage: node analyze-snapshot-stream.js <file.heapsnapshot> [top-N]");
  process.exit(1);
}

// V8 heap snapshot structure:
// node fields: [type, name, id, self_size, edge_count, trace_node_id, detachedness]
const NODE_FIELD_COUNT = 7;
const TYPE_IDX = 0;
const NAME_IDX = 1;
const SELF_SIZE_IDX = 3;

const NODE_TYPES = [
  "hidden", "array", "string", "object", "code", "closure",
  "regexp", "number", "native", "synthetic", "concatenated string",
  "sliced string", "symbol", "bigint", "object shape"
];

async function main() {
  console.log(`Analyzing: ${snapshotPath}`);
  const stat = fs.statSync(snapshotPath);
  console.log(`File size: ${(stat.size / 1024 / 1024).toFixed(0)} MB`);

  // Phase 1: Extract the nodes array and strings array using streaming
  // We parse the file as text, looking for the "nodes" and "strings" sections

  const stream = fs.createReadStream(snapshotPath, { encoding: "utf8", highWaterMark: 64 * 1024 });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let section = null; // 'nodes', 'edges', 'strings', etc.
  let nodesBuffer = "";
  let stringsBuffer = "";
  let nodeCount = 0;
  let edgeCount = 0;

  // Aggregation: key = nameIndex, value = { count, totalSize }
  const byName = new Map();
  const byType = new Map();

  let nodesInts = [];
  let nodesProcessed = 0;

  // State machine for streaming parse
  let inNodes = false;
  let inStrings = false;
  let bracketDepth = 0;
  let foundMeta = false;
  let snapshotNodeCount = 0;

  // We'll do a simpler approach: read the whole file line by line,
  // accumulate numbers from the "nodes" section, process them in batches

  console.log("Phase 1: Streaming through snapshot...");

  let currentKey = null;
  let numbersAccumulated = [];
  let stringsAccumulated = [];
  let totalSelfSize = 0;
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    const trimmed = line.trim();

    // Detect section changes
    if (trimmed.startsWith('"node_count"')) {
      const match = trimmed.match(/:\s*(\d+)/);
      if (match) snapshotNodeCount = parseInt(match[1]);
      continue;
    }

    if (trimmed === '"nodes":[' || trimmed.startsWith('"nodes": [') || trimmed.startsWith('"nodes":[')) {
      inNodes = true;
      inStrings = false;
      // Extract any numbers on this line after the [
      const afterBracket = trimmed.slice(trimmed.indexOf("[") + 1);
      if (afterBracket) {
        extractNumbers(afterBracket, numbersAccumulated);
      }
      continue;
    }

    if (trimmed === '"strings":[' || trimmed.startsWith('"strings": [') || trimmed.startsWith('"strings":[')) {
      inNodes = false;
      inStrings = true;
      continue;
    }

    if (trimmed === '"edges":[' || trimmed.startsWith('"edges": [') || trimmed.startsWith('"edges":[')) {
      // Process accumulated nodes
      if (numbersAccumulated.length > 0) {
        processNodes(numbersAccumulated, byName, byType);
        totalSelfSize = computeTotalSize(byName);
      }
      inNodes = false;
      inStrings = false;
      continue;
    }

    if (trimmed === '"trace_function_infos":[' || trimmed.startsWith('"trace_function_infos":') ||
        trimmed === '"trace_tree":[' || trimmed.startsWith('"trace_tree":') ||
        trimmed === '"samples":[' || trimmed.startsWith('"samples":') ||
        trimmed === '"locations":[' || trimmed.startsWith('"locations":')) {
      inNodes = false;
      inStrings = false;
      continue;
    }

    if (inNodes) {
      extractNumbers(trimmed, numbersAccumulated);
      // Process in batches to avoid OOM
      if (numbersAccumulated.length > 700000) {
        processNodes(numbersAccumulated, byName, byType);
        numbersAccumulated = [];
      }
    }

    if (inStrings) {
      // Extract string literals
      extractStrings(trimmed, stringsAccumulated);
    }

    if (lineNum % 1000000 === 0) {
      process.stderr.write(`  ${lineNum} lines, ${numbersAccumulated.length} numbers, ${stringsAccumulated.length} strings...\r`);
    }
  }

  // Process any remaining nodes
  if (numbersAccumulated.length > 0) {
    processNodes(numbersAccumulated, byName, byType);
  }

  process.stderr.write("\n");
  console.log(`Total lines: ${lineNum}`);
  console.log(`Total strings: ${stringsAccumulated.length}`);

  // Phase 2: Resolve names and print results
  console.log("\n=== Top constructors by total self_size ===\n");

  const nameResults = [];
  for (const [nameIdx, stats] of byName) {
    const name = stringsAccumulated[nameIdx] || `(string#${nameIdx})`;
    nameResults.push({ name, count: stats.count, totalSize: stats.totalSize });
  }
  nameResults.sort((a, b) => b.totalSize - a.totalSize);

  const totalSize = nameResults.reduce((s, r) => s + r.totalSize, 0);
  console.log(`Total self_size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Total objects: ${nameResults.reduce((s, r) => s + r.count, 0)}\n`);

  console.log("Constructor".padEnd(60) + "Count".padStart(10) + "Self Size (MB)".padStart(16) + "% of total".padStart(12));
  console.log("-".repeat(98));

  for (const r of nameResults.slice(0, topN)) {
    const sizeMB = (r.totalSize / 1024 / 1024).toFixed(1);
    const pct = ((r.totalSize / totalSize) * 100).toFixed(1);
    console.log(
      r.name.slice(0, 59).padEnd(60) +
      String(r.count).padStart(10) +
      (sizeMB + " MB").padStart(16) +
      (pct + "%").padStart(12)
    );
  }

  // Phase 3: by type
  console.log("\n=== By node type ===\n");
  console.log("Type".padEnd(25) + "Count".padStart(12) + "Self Size (MB)".padStart(16) + "% of total".padStart(12));
  console.log("-".repeat(65));

  const typeResults = [];
  for (const [typeIdx, stats] of byType) {
    typeResults.push({ type: NODE_TYPES[typeIdx] || `type#${typeIdx}`, count: stats.count, totalSize: stats.totalSize });
  }
  typeResults.sort((a, b) => b.totalSize - a.totalSize);

  for (const r of typeResults) {
    const sizeMB = (r.totalSize / 1024 / 1024).toFixed(1);
    const pct = ((r.totalSize / totalSize) * 100).toFixed(1);
    console.log(
      r.type.padEnd(25) +
      String(r.count).padStart(12) +
      (sizeMB + " MB").padStart(16) +
      (pct + "%").padStart(12)
    );
  }
}

function extractNumbers(line, acc) {
  // Extract all integers from a line (heap snapshot nodes are integers)
  const matches = line.match(/-?\d+/g);
  if (matches) {
    for (const m of matches) {
      acc.push(parseInt(m, 10));
    }
  }
}

function extractStrings(line, acc) {
  // Extract JSON string values from a strings array line
  // Lines look like: "string value",
  const trimmed = line.trim();
  if (trimmed.startsWith('"')) {
    // Try to parse as JSON string
    let str = trimmed;
    if (str.endsWith(",")) str = str.slice(0, -1);
    if (str.endsWith("]")) str = str.slice(0, -1);
    try {
      acc.push(JSON.parse(str));
    } catch {
      acc.push(str);
    }
  } else if (trimmed === "]" || trimmed === "],") {
    // End of strings array
  }
}

function processNodes(numbers, byName, byType) {
  // Process accumulated node field integers
  // Each node: [type, name, id, self_size, edge_count, trace_node_id, detachedness]
  const count = Math.floor(numbers.length / NODE_FIELD_COUNT);
  for (let i = 0; i < count; i++) {
    const offset = i * NODE_FIELD_COUNT;
    const type = numbers[offset + TYPE_IDX];
    const nameIdx = numbers[offset + NAME_IDX];
    const selfSize = numbers[offset + SELF_SIZE_IDX];

    // Aggregate by name
    let entry = byName.get(nameIdx);
    if (!entry) {
      entry = { count: 0, totalSize: 0 };
      byName.set(nameIdx, entry);
    }
    entry.count++;
    entry.totalSize += selfSize;

    // Aggregate by type
    let typeEntry = byType.get(type);
    if (!typeEntry) {
      typeEntry = { count: 0, totalSize: 0 };
      byType.set(type, typeEntry);
    }
    typeEntry.count++;
    typeEntry.totalSize += selfSize;
  }

  // Keep remainder for next batch
  const remainder = numbers.length % NODE_FIELD_COUNT;
  if (remainder > 0) {
    const leftover = numbers.splice(count * NODE_FIELD_COUNT);
    numbers.length = 0;
    numbers.push(...leftover);
  } else {
    numbers.length = 0;
  }
}

function computeTotalSize(byName) {
  let total = 0;
  for (const stats of byName.values()) {
    total += stats.totalSize;
  }
  return total;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
