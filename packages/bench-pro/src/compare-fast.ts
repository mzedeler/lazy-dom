// Focused benchmark: runs only fast tests (< 120ms in JSDOM) multiple times
// to get stable measurements and isolate per-test overhead.

import { execSync } from "node:child_process"
import path from "node:path"

const proDir = path.resolve(__dirname, "../../../pro")

interface JestTestResult {
  name: string
  startTime: number
  endTime: number
  status: "passed" | "failed"
}

interface JestOutput {
  numPassedTestSuites: number
  numFailedTestSuites: number
  testResults: JestTestResult[]
  startTime: number
}

// 20 fast tests: mix of pure .ts utilities and light .tsx components
const fastTests = [
  "utils/deCamelCaseObjectKeys.test.ts",
  "utils/ellipsis.test.ts",
  "utils/formatDate.test.ts",
  "utils/getBookCategory.test.ts",
  "utils/moveItemInArray.test.ts",
  "utils/normalize.test.ts",
  "utils/copyToClipboard.test.ts",
  "utils/intersperse.test.ts",
  "utils/invariant.test.ts",
  "utils/uniqueArray.test.ts",
  "components/AnnotationItem/utils/getMostSpecificAnchor.test.ts",
  "components/AreaLayout/WidgetEditorPanel/reducer.test.ts",
  "components/SearchAlertToggle/utils/emptyQueryParams.test.ts",
  "store/actions/utils/toggleItem.test.ts",
  "store/actions/utils/getMediaSize.test.ts",
  "store/utils/getDeviceSize.test.ts",
  "components/ErrorBoundary/ErrorBoundary.test.tsx",
  "components/ErrorMessage/ErrorMessage.test.tsx",
  "components/NoAccess/NoAccess.test.tsx",
  "components/Pagination/index.test.tsx",
]

// Build a regex pattern that matches any of these paths
const pattern = fastTests.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")

function runJest(testEnvironment: string, extraEnv: Record<string, string> = {}): JestOutput {
  const cmd = `npx jest --json --runInBand --forceExit --testEnvironment ${testEnvironment} --testPathPattern '${pattern}'`

  try {
    const stdout = execSync(cmd, {
      cwd: proDir,
      env: { ...process.env, ...extraEnv },
      maxBuffer: 100 * 1024 * 1024,
      timeout: 5 * 60 * 1000,
    })
    return JSON.parse(stdout.toString())
  } catch (err: unknown) {
    if (
      err !== null &&
      typeof err === "object" &&
      "stdout" in err &&
      Buffer.isBuffer(err.stdout)
    ) {
      try {
        return JSON.parse(err.stdout.toString())
      } catch {
        console.error("Failed to parse Jest JSON output")
        throw err
      }
    }
    throw err
  }
}

function relativePath(absolutePath: string): string {
  return path.relative(proDir, absolutePath)
}

const RUNS = 3
const envs = [
  { name: "JSDOM", env: "jest-fixed-jsdom", extraEnv: {} },
  { name: "lazy-dom", env: "jest-environment-lazy-dom", extraEnv: { ALLOW_CONSOLE_OUTPUT: "true" } },
]

console.log(`=== Fast-Test Benchmark (${fastTests.length} tests, ${RUNS} runs each) ===\n`)

// Collect results: envName -> run -> filePath -> ms
const allResults: Record<string, Array<Map<string, number>>> = {}

for (const { name, env, extraEnv } of envs) {
  allResults[name] = []
  for (let run = 0; run < RUNS; run++) {
    console.log(`  ${name} run ${run + 1}/${RUNS}...`)
    const output = runJest(env, extraEnv)
    const byPath = new Map<string, number>()
    for (const result of output.testResults) {
      if (result.status === "passed") {
        byPath.set(relativePath(result.name), result.endTime - result.startTime)
      }
    }
    allResults[name].push(byPath)
    console.log(`    ${byPath.size} passed`)
  }
}

// Compute median across runs for each test
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// Collect all file paths that passed in all runs of both envs
const jsdomRuns = allResults["JSDOM"]
const lazyRuns = allResults["lazy-dom"]

const allFiles = new Set<string>()
for (const run of jsdomRuns) {
  for (const key of run.keys()) allFiles.add(key)
}

interface FileResult {
  file: string
  jsdomMedian: number
  lazyMedian: number
  overhead: number
  jsdomAll: number[]
  lazyAll: number[]
}

const results: FileResult[] = []
let totalJsdom = 0
let totalLazy = 0

for (const file of [...allFiles].sort()) {
  const jsdomTimes = jsdomRuns.map(r => r.get(file)).filter((v): v is number => v !== undefined)
  const lazyTimes = lazyRuns.map(r => r.get(file)).filter((v): v is number => v !== undefined)

  if (jsdomTimes.length < RUNS || lazyTimes.length < RUNS) continue

  const jm = median(jsdomTimes)
  const lm = median(lazyTimes)
  totalJsdom += jm
  totalLazy += lm

  results.push({
    file,
    jsdomMedian: jm,
    lazyMedian: lm,
    overhead: lm - jm,
    jsdomAll: jsdomTimes,
    lazyAll: lazyTimes,
  })
}

// Sort by overhead descending
results.sort((a, b) => b.overhead - a.overhead)

console.log(`\n=== Results (median of ${RUNS} runs) ===\n`)

const maxFile = Math.max(12, ...results.map(r => r.file.length))
const hdr = [
  "Test file".padEnd(maxFile),
  "JSDOM".padStart(8),
  "lazy".padStart(8),
  "overhead".padStart(10),
  "ratio".padStart(8),
].join(" | ")
const sep = "-".repeat(hdr.length)
console.log(hdr)
console.log(sep)

for (const r of results) {
  const ratio = r.jsdomMedian > 0 ? (r.jsdomMedian / r.lazyMedian).toFixed(2) : "N/A"
  console.log([
    r.file.padEnd(maxFile),
    `${Math.round(r.jsdomMedian)}ms`.padStart(8),
    `${Math.round(r.lazyMedian)}ms`.padStart(8),
    `+${Math.round(r.overhead)}ms`.padStart(10),
    `${ratio}x`.padStart(8),
  ].join(" | "))
}

console.log(sep)
console.log([
  `TOTAL (${results.length} tests)`.padEnd(maxFile),
  `${Math.round(totalJsdom)}ms`.padStart(8),
  `${Math.round(totalLazy)}ms`.padStart(8),
  `+${Math.round(totalLazy - totalJsdom)}ms`.padStart(10),
  `${(totalJsdom / totalLazy).toFixed(2)}x`.padStart(8),
].join(" | "))

console.log(`\nAverage per-test overhead: +${Math.round((totalLazy - totalJsdom) / results.length)}ms`)

// Breakdown: pure .ts vs .tsx
const tsOnly = results.filter(r => r.file.endsWith(".test.ts"))
const tsxOnly = results.filter(r => r.file.endsWith(".test.tsx"))

function stats(items: FileResult[]) {
  const jTotal = items.reduce((s, r) => s + r.jsdomMedian, 0)
  const lTotal = items.reduce((s, r) => s + r.lazyMedian, 0)
  return {
    count: items.length,
    jsdomTotal: Math.round(jTotal),
    lazyTotal: Math.round(lTotal),
    overhead: Math.round(lTotal - jTotal),
    avgOverhead: Math.round((lTotal - jTotal) / items.length),
    ratio: (jTotal / lTotal).toFixed(2),
  }
}

console.log("\n=== Breakdown by file type ===")
const tsStats = stats(tsOnly)
console.log(`  .ts  (${tsStats.count} files): JSDOM ${tsStats.jsdomTotal}ms, lazy ${tsStats.lazyTotal}ms, overhead +${tsStats.overhead}ms (avg +${tsStats.avgOverhead}ms/test, ${tsStats.ratio}x)`)
const tsxStats = stats(tsxOnly)
console.log(`  .tsx (${tsxStats.count} files): JSDOM ${tsxStats.jsdomTotal}ms, lazy ${tsxStats.lazyTotal}ms, overhead +${tsxStats.overhead}ms (avg +${tsxStats.avgOverhead}ms/test, ${tsxStats.ratio}x)`)

// Show individual run times for stability analysis
console.log("\n=== Run stability (all runs) ===")
for (const r of results.slice(0, 5)) {
  console.log(`  ${r.file}:`)
  console.log(`    JSDOM: ${r.jsdomAll.map(v => v + "ms").join(", ")}`)
  console.log(`    lazy:  ${r.lazyAll.map(v => v + "ms").join(", ")}`)
}
