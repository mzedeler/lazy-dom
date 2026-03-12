/**
 * Memory benchmark: measures heap growth when running the production test
 * suite with JSDOM vs lazy-dom.
 *
 * For each environment, runs the full jest suite in a child process with
 * --expose-gc, capturing heap snapshots and process.memoryUsage() before
 * and after via globalSetup/globalTeardown hooks.
 *
 * Usage:
 *   pnpm --filter @lazy-dom/bench-pro memory:bench [testPathPattern]
 */
import { execFileSync } from "node:child_process"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

const proDir = path.resolve(__dirname, "../../../pro")
const benchDir = path.resolve(__dirname, "..")
const setupPath = path.resolve(__dirname, "memory-bench-setup-lite.js")
const teardownPath = path.resolve(__dirname, "memory-bench-teardown-lite.js")
const jestBin = path.resolve(proDir, "node_modules/jest/bin/jest.js")

interface MemoryUsage {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  arrayBuffers: number
}

interface JestOutput {
  numPassedTestSuites: number
  numFailedTestSuites: number
  numTotalTestSuites: number
  startTime: number
  testResults: Array<{
    name: string
    startTime: number
    endTime: number
    status: "passed" | "failed"
  }>
}

interface RunResult {
  label: string
  before: MemoryUsage
  after: MemoryUsage
  numSuites: number
  wallMs: number
}

function mb(bytes: number): number {
  return Math.round(bytes / 1024 / 1024)
}

function readMemoryFile(filePath: string): MemoryUsage {
  if (!existsSync(filePath)) {
    throw new Error(`Memory file not found: ${filePath}`)
  }
  return JSON.parse(readFileSync(filePath, "utf8")) as MemoryUsage
}

function extractJson(raw: string): JestOutput {
  // Jest --json output may have non-JSON lines before the JSON object
  // (e.g. globalSetup console output). Find the JSON start.
  const jsonStart = raw.indexOf('{"')
  if (jsonStart === -1) {
    throw new Error("No JSON object found in Jest output")
  }
  return JSON.parse(raw.slice(jsonStart)) as JestOutput
}

function runJest(
  label: string,
  testEnvironment: string,
  extraEnv: Record<string, string> = {}
): RunResult {
  const testPathPattern = ""

  const args = [
    "--expose-gc",
    jestBin,
    "--json",
    "--runInBand",
    "--forceExit",
    "--testEnvironment", testEnvironment,
    "--globalSetup", setupPath,
    "--globalTeardown", teardownPath,
  ]
  if (testPathPattern) {
    args.push("--testPathPattern", testPathPattern)
  }

  console.log(`\n--- ${label} ---`)
  console.log(`  Running: node ${args.join(" ")}`)

  const start = Date.now()

  let jestOutput: JestOutput | undefined
  try {
    const stdout = execFileSync("node", args, {
      cwd: proDir,
      env: {
        ...process.env,
        ...extraEnv,
        HEAP_SNAPSHOT_LABEL: label,
        HEAP_SNAPSHOT_DIR: benchDir,
      },
      stdio: ["pipe", "pipe", "inherit"],
      maxBuffer: 100 * 1024 * 1024,
      timeout: 30 * 60 * 1000,
    })
    jestOutput = extractJson(stdout.toString())
  } catch (err: unknown) {
    // Jest exits non-zero when tests fail, but stdout still has JSON
    if (
      err !== null &&
      typeof err === "object" &&
      "stdout" in err &&
      Buffer.isBuffer(err.stdout)
    ) {
      try {
        jestOutput = extractJson(err.stdout.toString())
      } catch {
        console.error("  Failed to parse Jest JSON output")
        throw err
      }
    } else {
      throw err
    }
  }

  const wallMs = Date.now() - start

  if (jestOutput) {
    console.log(
      `  Done: ${jestOutput.numPassedTestSuites} passed, ${jestOutput.numFailedTestSuites} failed, ${jestOutput.numTotalTestSuites} total`
    )
  }

  const before = readMemoryFile(path.join(benchDir, `${label}-before-memory.json`))
  const after = readMemoryFile(path.join(benchDir, `${label}-after-memory.json`))

  return {
    label,
    before,
    after,
    numSuites: jestOutput?.numTotalTestSuites ?? 0,
    wallMs,
  }
}

// --- Main ---

console.log("=== Memory Benchmark: JSDOM vs lazy-dom ===")
console.log(`  Snapshot directory: ${benchDir}`)

const results: RunResult[] = []

results.push(runJest("jsdom", "jest-fixed-jsdom"))

results.push(
  runJest("lazy-dom", "jest-environment-lazy-dom", {
    ALLOW_CONSOLE_OUTPUT: "true",
  })
)

// --- Summary table ---

console.log("\n\n=== Memory Summary ===\n")

console.log(
  "Mode              | Suites | heapUsed before | heapUsed after | heapUsed growth | Rate (MB/suite) | Wall time"
)
console.log(
  "------------------|--------|-----------------|----------------|-----------------|-----------------|----------"
)

for (const r of results) {
  const heapBefore = mb(r.before.heapUsed)
  const heapAfter = mb(r.after.heapUsed)
  const growth = heapAfter - heapBefore
  const rate =
    r.numSuites > 0 ? (growth / r.numSuites).toFixed(3) : "N/A"
  const wall =
    r.wallMs >= 1000
      ? `${(r.wallMs / 1000).toFixed(1)}s`
      : `${r.wallMs}ms`

  console.log(
    `${r.label.padEnd(18)}| ${String(r.numSuites).padStart(6)} | ${String(heapBefore + " MB").padStart(15)} | ${String(heapAfter + " MB").padStart(14)} | ${String("+" + growth + " MB").padStart(15)} | ${String(rate).padStart(15)} | ${wall}`
  )
}

// --- RSS comparison ---

console.log("\n=== RSS Summary ===\n")

console.log(
  "Mode              | RSS before | RSS after  | RSS growth"
)
console.log(
  "------------------|------------|------------|----------"
)

for (const r of results) {
  const rssBefore = mb(r.before.rss)
  const rssAfter = mb(r.after.rss)
  const growth = rssAfter - rssBefore

  console.log(
    `${r.label.padEnd(18)}| ${String(rssBefore + " MB").padStart(10)} | ${String(rssAfter + " MB").padStart(10)} | ${String("+" + growth + " MB").padStart(10)}`
  )
}

// --- Memory files ---

console.log("\n=== Memory Files ===\n")
for (const r of results) {
  const beforeFile = path.join(benchDir, `${r.label}-before-memory.json`)
  const afterFile = path.join(benchDir, `${r.label}-after-memory.json`)
  console.log(`  ${r.label}:`)
  console.log(`    before: ${beforeFile}`)
  console.log(`    after:  ${afterFile}`)
}
