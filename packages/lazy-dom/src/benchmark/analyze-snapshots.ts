/**
 * Heap snapshot comparison tool.
 *
 * Parses V8 heap snapshots and compares object counts + sizes by constructor.
 * Shows which object types grew between snapshots.
 *
 * Usage:
 *   npx tsx --max-old-space-size=4096 src/benchmark/analyze-snapshots.ts \
 *     snapshot1.heapsnapshot snapshot2.heapsnapshot [snapshot3.heapsnapshot]
 */
import { readFileSync } from 'fs'

interface SnapshotMeta {
  node_fields: string[]
  node_types: unknown[][]
  edge_fields: string[]
  edge_types: unknown[][]
}

interface HeapSnapshot {
  snapshot: { meta: SnapshotMeta; node_count: number; edge_count: number }
  nodes: number[]
  edges: number[]
  strings: string[]
}

interface TypeStats {
  count: number
  selfSize: number
}

function parseSnapshot(path: string): Map<string, TypeStats> {
  console.error(`  Parsing ${path}...`)
  const raw = readFileSync(path, 'utf8')
  const snap: HeapSnapshot = JSON.parse(raw)

  const nodeFields = snap.snapshot.meta.node_fields
  const nodeTypes = snap.snapshot.meta.node_types[0] as string[]
  const stride = nodeFields.length  // typically 7

  const typeIdx = nodeFields.indexOf('type')
  const nameIdx = nodeFields.indexOf('name')
  const selfSizeIdx = nodeFields.indexOf('self_size')

  const stats = new Map<string, TypeStats>()

  for (let i = 0; i < snap.nodes.length; i += stride) {
    const typeId = snap.nodes[i + typeIdx]
    const nameId = snap.nodes[i + nameIdx]
    const selfSize = snap.nodes[i + selfSizeIdx]

    const typeName = nodeTypes[typeId]
    const name = snap.strings[nameId]

    // Key: "type::name" — same as Chrome DevTools "Constructor" column
    const key = `${typeName}::${name}`

    const existing = stats.get(key)
    if (existing) {
      existing.count++
      existing.selfSize += selfSize
    } else {
      stats.set(key, { count: 1, selfSize })
    }
  }

  return stats
}

function compareSnapshots(
  label: string,
  before: Map<string, TypeStats>,
  after: Map<string, TypeStats>,
  topN = 30
): void {
  const diffs: Array<{
    key: string
    countBefore: number
    countAfter: number
    countDelta: number
    sizeBefore: number
    sizeAfter: number
    sizeDelta: number
  }> = []

  // Collect all keys from both snapshots
  const allKeys = new Set([...before.keys(), ...after.keys()])

  for (const key of allKeys) {
    const b = before.get(key) ?? { count: 0, selfSize: 0 }
    const a = after.get(key) ?? { count: 0, selfSize: 0 }
    const countDelta = a.count - b.count
    const sizeDelta = a.selfSize - b.selfSize

    if (sizeDelta !== 0 || countDelta !== 0) {
      diffs.push({
        key,
        countBefore: b.count,
        countAfter: a.count,
        countDelta,
        sizeBefore: b.selfSize,
        sizeAfter: a.selfSize,
        sizeDelta,
      })
    }
  }

  // Sort by size delta descending
  diffs.sort((a, b) => b.sizeDelta - a.sizeDelta)

  console.log('')
  console.log(`=== ${label} ===`)
  console.log('')

  // Summary
  let totalSizeDelta = 0
  let totalCountDelta = 0
  for (const d of diffs) {
    totalSizeDelta += d.sizeDelta
    totalCountDelta += d.countDelta
  }
  console.log(`Total: ${totalCountDelta >= 0 ? '+' : ''}${totalCountDelta.toLocaleString()} objects, ${totalSizeDelta >= 0 ? '+' : ''}${formatBytes(totalSizeDelta)}`)
  console.log('')

  // Top growers by size
  console.log(`Top ${topN} growers by size:`)
  console.log('')
  console.log('| Type | Count (before → after) | Size delta | Size (before → after) |')
  console.log('|------|------------------------|------------|----------------------|')

  for (let i = 0; i < Math.min(topN, diffs.length); i++) {
    const d = diffs[i]
    if (d.sizeDelta <= 0) break  // only show growers
    console.log(
      `| ${d.key} | ${d.countBefore.toLocaleString()} → ${d.countAfter.toLocaleString()} (+${d.countDelta.toLocaleString()}) | +${formatBytes(d.sizeDelta)} | ${formatBytes(d.sizeBefore)} → ${formatBytes(d.sizeAfter)} |`
    )
  }

  // Top shrinkers (if any significant ones)
  const shrinkers = diffs.filter(d => d.sizeDelta < -10000).sort((a, b) => a.sizeDelta - b.sizeDelta)
  if (shrinkers.length > 0) {
    console.log('')
    console.log('Notable shrinkers:')
    console.log('')
    console.log('| Type | Count delta | Size delta |')
    console.log('|------|-------------|------------|')
    for (let i = 0; i < Math.min(10, shrinkers.length); i++) {
      const d = shrinkers[i]
      console.log(`| ${d.key} | ${d.countDelta.toLocaleString()} | ${formatBytes(d.sizeDelta)} |`)
    }
  }
}

function formatBytes(bytes: number): string {
  const abs = Math.abs(bytes)
  const sign = bytes < 0 ? '-' : ''
  if (abs >= 1024 * 1024) return `${sign}${(abs / 1024 / 1024).toFixed(1)} MB`
  if (abs >= 1024) return `${sign}${(abs / 1024).toFixed(1)} KB`
  return `${sign}${abs} B`
}

// ---------- main ----------
const args = process.argv.slice(2)
if (args.length < 2) {
  console.error('Usage: analyze-snapshots.ts <snap1> <snap2> [snap3]')
  process.exit(1)
}

console.error('Parsing snapshots...')
const snap1 = parseSnapshot(args[0])

const snap2 = parseSnapshot(args[1])
compareSnapshots('Snapshot 1 → 2 (first batch)', snap1, snap2)

if (args[2]) {
  // Free snap1 early to reduce memory pressure
  snap1.clear()
  const snap3 = parseSnapshot(args[2])
  compareSnapshots('Snapshot 2 → 3 (second batch)', snap2, snap3)
}
