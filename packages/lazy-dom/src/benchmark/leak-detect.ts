/**
 * Memory leak detection script.
 *
 * Phase 1: Run a benchmark function many times, printing RSS every N
 *          iterations to show monotonic growth.
 *
 * Phase 2: Take three V8 heap snapshots — before any runs, after N runs,
 *          and after 2N runs — for differential analysis.
 *
 * Usage:
 *   cd packages/lazy-dom
 *   npx tsx --expose-gc src/benchmark/leak-detect.ts
 *
 * Note: WeakRef targets are only cleared after an event-loop turn,
 * so GC must be followed by `await setImmediate()` to properly
 * release orphaned DOM subtrees.
 */
import { writeHeapSnapshot } from 'v8'
import lazyDom, { reset } from '../lazyDom'

// Initialise lazy-dom globals (document, window, classes)
lazyDom()

// ---------- pick the workload ----------
// Using outerHTMLRealisticTree — ~70 elements + full serialization.
// This exercises createElement, setAttribute, appendChild, removeChild,
// textNode creation, and outerHTML (forces all thunk evaluation).
import { outerHTMLRealisticTree } from './suite/dom.outerHTML'
const workload = outerHTMLRealisticTree

// ---------- configuration ----------
const PHASE1_TOTAL = 10000    // iterations for monotonic-growth check
const PHASE1_INTERVAL = 1000  // print RSS every N iterations
const PHASE2_BATCH = 500      // iterations between snapshots

function rssMb(): number {
  return Math.round(process.memoryUsage.rss() / 1024 / 1024)
}

function heapMb(): number {
  return Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
}

function runBatch(n: number): void {
  for (let i = 0; i < n; i++) {
    workload()
  }
}

/** GC + event-loop turn so V8 clears WeakRef targets. */
async function gcAsync(): Promise<void> {
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
  global.gc!()
  await new Promise<void>(r => setImmediate(r))
}

async function main() {
  // ---------- Phase 1: monotonic growth check ----------
  console.log('=== Phase 1: monotonic growth check ===')
  console.log(`Running ${PHASE1_TOTAL} iterations, reporting every ${PHASE1_INTERVAL}`)
  console.log('')
  console.log('| iteration | RSS (MB) | heap (MB) |')
  console.log('|-----------|----------|-----------|')

  // Warm up once so module-level lazy initialisation is excluded
  workload()
  await gcAsync()

  console.log(`| 0 | ${rssMb()} MB | ${heapMb()} MB |`)

  for (let done = 0; done < PHASE1_TOTAL; done += PHASE1_INTERVAL) {
    runBatch(PHASE1_INTERVAL)
    await gcAsync()
    console.log(`| ${done + PHASE1_INTERVAL} | ${rssMb()} MB | ${heapMb()} MB |`)
  }

  console.log('')

  // Reset between phases (simulates jest teardown between test files)
  reset()
  lazyDom()
  await gcAsync()

  // ---------- Phase 2: three heap snapshots ----------
  console.log('=== Phase 2: heap snapshots ===')
  console.log(`Taking 3 snapshots: baseline, after ${PHASE2_BATCH}, after ${PHASE2_BATCH * 2} iterations`)
  console.log('')

  await gcAsync()
  const snap1 = writeHeapSnapshot()
  console.log(`Snapshot 1 (baseline):            ${snap1}  RSS=${rssMb()} MB  heap=${heapMb()} MB`)

  runBatch(PHASE2_BATCH)
  await gcAsync()
  const snap2 = writeHeapSnapshot()
  console.log(`Snapshot 2 (after ${PHASE2_BATCH} runs):  ${snap2}  RSS=${rssMb()} MB  heap=${heapMb()} MB`)

  runBatch(PHASE2_BATCH)
  await gcAsync()
  const snap3 = writeHeapSnapshot()
  console.log(`Snapshot 3 (after ${PHASE2_BATCH * 2} runs): ${snap3}  RSS=${rssMb()} MB  heap=${heapMb()} MB`)

  console.log('')
  console.log('Done. Use analyze-snapshots.ts to compare, or load in Chrome DevTools.')
}

main()
