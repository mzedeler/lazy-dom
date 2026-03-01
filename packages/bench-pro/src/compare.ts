import { execSync } from "node:child_process"
import path from "node:path"

const proDir = path.resolve(__dirname, "../../../pro")

interface JestAssertionResult {
  fullName: string
  duration: number | null
  status: "passed" | "failed" | "pending" | "skipped"
}

interface JestTestResult {
  name: string
  startTime: number
  endTime: number
  status: "passed" | "failed"
  assertionResults: JestAssertionResult[]
}

interface JestOutput {
  numPassedTestSuites: number
  numFailedTestSuites: number
  numTotalTestSuites: number
  testResults: JestTestResult[]
  startTime: number
}

function runJest(testEnvironment: string, extraEnv: Record<string, string> = {}): JestOutput {
  const testPathPattern = process.argv[2] || ""
  const patternArg = testPathPattern ? ` --testPathPattern '${testPathPattern}'` : ""

  const cmd = `npx jest --json --runInBand --forceExit --testEnvironment ${testEnvironment}${patternArg}`

  console.log(`Running: ${cmd}`)
  console.log(`  cwd: ${proDir}`)
  console.log(`  env: ${JSON.stringify(extraEnv)}`)

  try {
    const stdout = execSync(cmd, {
      cwd: proDir,
      env: { ...process.env, ...extraEnv },
      maxBuffer: 100 * 1024 * 1024,
      timeout: 30 * 60 * 1000,
    })
    return JSON.parse(stdout.toString())
  } catch (err: unknown) {
    // Jest exits non-zero when tests fail, but stdout still has JSON
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

function formatMs(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`
  }
  return `${Math.round(ms)}ms`
}

function formatSpeedup(jsdomMs: number, lazyMs: number): string {
  const ratio = jsdomMs / lazyMs
  const pct = ((1 - lazyMs / jsdomMs) * 100).toFixed(0)
  return `${ratio.toFixed(1)}x (${pct}%)`
}

// --- Main ---

console.log("=== Benchmark: JSDOM vs lazy-dom ===\n")

console.log("--- Running JSDOM suite ---")
const jsdomResults = runJest("jest-fixed-jsdom")
console.log(`  Done: ${jsdomResults.numPassedTestSuites} passed, ${jsdomResults.numFailedTestSuites} failed\n`)

console.log("--- Running lazy-dom suite ---")
const lazyResults = runJest("jest-environment-lazy-dom", {
  ALLOW_CONSOLE_OUTPUT: "true",
})
console.log(`  Done: ${lazyResults.numPassedTestSuites} passed, ${lazyResults.numFailedTestSuites} failed\n`)

// Build lookup by relative path
const jsdomByPath = new Map<string, JestTestResult>()
for (const result of jsdomResults.testResults) {
  jsdomByPath.set(relativePath(result.name), result)
}

const lazyByPath = new Map<string, JestTestResult>()
for (const result of lazyResults.testResults) {
  lazyByPath.set(relativePath(result.name), result)
}

// All test file paths
const allPaths = new Set([...jsdomByPath.keys(), ...lazyByPath.keys()])
const sortedPaths = [...allPaths].sort()

// Compute table rows
interface Row {
  file: string
  jsdomMs: number
  lazyMs: number | null
  lazyStatus: "passed" | "failed" | "missing"
  speedup: string
}

const rows: Row[] = []
let totalJsdomMs = 0
let totalLazyMs = 0
let bothPassedCount = 0
let lazyFailedCount = 0

for (const filePath of sortedPaths) {
  const jsdom = jsdomByPath.get(filePath)
  const lazy = lazyByPath.get(filePath)

  const jsdomMs = jsdom ? jsdom.endTime - jsdom.startTime : 0
  const lazyMs = lazy ? lazy.endTime - lazy.startTime : null
  const lazyStatus: Row["lazyStatus"] = !lazy
    ? "missing"
    : lazy.status === "passed"
      ? "passed"
      : "failed"

  let speedup = ""
  if (lazyStatus === "passed" && lazyMs !== null && jsdomMs > 0) {
    speedup = formatSpeedup(jsdomMs, lazyMs)
    totalJsdomMs += jsdomMs
    totalLazyMs += lazyMs
    bothPassedCount++
  } else if (lazyStatus !== "passed") {
    lazyFailedCount++
  }

  rows.push({ file: filePath, jsdomMs, lazyMs, lazyStatus, speedup })
}

// Print table
const colWidths = {
  file: Math.max(10, ...rows.map((r) => r.file.length)),
  jsdom: 10,
  lazy: 10,
  speedup: 16,
}

const pad = (s: string, w: number) => s.padEnd(w)
const padR = (s: string, w: number) => s.padStart(w)

const header = [
  pad("Test file", colWidths.file),
  padR("JSDOM", colWidths.jsdom),
  padR("lazy-dom", colWidths.lazy),
  padR("Speedup", colWidths.speedup),
].join(" | ")

const separator = [
  "-".repeat(colWidths.file),
  "-".repeat(colWidths.jsdom),
  "-".repeat(colWidths.lazy),
  "-".repeat(colWidths.speedup),
].join("-+-")

console.log("\n" + header)
console.log(separator)

for (const row of rows) {
  const lazyCol =
    row.lazyStatus === "passed" && row.lazyMs !== null
      ? formatMs(row.lazyMs)
      : row.lazyStatus === "failed"
        ? "FAIL"
        : "N/A"

  const line = [
    pad(row.file, colWidths.file),
    padR(formatMs(row.jsdomMs), colWidths.jsdom),
    padR(lazyCol, colWidths.lazy),
    padR(row.speedup, colWidths.speedup),
  ].join(" | ")

  console.log(line)
}

console.log(separator)

// Totals
if (bothPassedCount > 0) {
  const totalSpeedup = formatSpeedup(totalJsdomMs, totalLazyMs)
  const totalsLine = [
    pad(`TOTAL (${bothPassedCount} suites)`, colWidths.file),
    padR(formatMs(totalJsdomMs), colWidths.jsdom),
    padR(formatMs(totalLazyMs), colWidths.lazy),
    padR(totalSpeedup, colWidths.speedup),
  ].join(" | ")
  console.log(totalsLine)
}

console.log(
  `\nSuites passing in both: ${bothPassedCount}/${sortedPaths.length}`
)
console.log(`Suites failing/missing in lazy-dom: ${lazyFailedCount}`)
