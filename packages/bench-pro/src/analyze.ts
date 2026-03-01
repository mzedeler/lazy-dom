import { execSync } from "node:child_process"
import path from "node:path"

const proDir = path.resolve(__dirname, "../../../pro")

const cmd = "npx jest --testEnvironment jest-environment-lazy-dom --runInBand --json --forceExit"

let json: string
try {
  json = execSync(cmd, {
    cwd: proDir,
    env: { ...process.env, ALLOW_CONSOLE_OUTPUT: "true" },
    maxBuffer: 100 * 1024 * 1024,
    timeout: 30 * 60 * 1000,
  }).toString()
} catch (err: unknown) {
  if (err !== null && typeof err === "object" && "stdout" in err && Buffer.isBuffer(err.stdout)) {
    json = err.stdout.toString()
  } else {
    throw err
  }
}

interface AssertionResult {
  status: string
  failureMessages: string[]
}

interface TestResult {
  name: string
  status: string
  assertionResults: AssertionResult[]
  testExecError?: { message: string }
}

interface JestOutput {
  testResults: TestResult[]
}

const data: JestOutput = JSON.parse(json)
const failed = data.testResults.filter((r) => r.status === "failed")
const passed = data.testResults.filter((r) => r.status === "passed")

console.log(`Passed: ${passed.length} / Failed: ${failed.length} / Total: ${data.testResults.length}`)
console.log()

// Categorize failures by error message
const categories: Record<string, Set<string>> = {}

for (const r of failed) {
  const relName = r.name.replace(/.*pro\//, "")

  // Suite-level exec errors
  if (r.testExecError) {
    const msg = r.testExecError.message
    const match = msg.match(/^(\w+Error:? [^\n]{0,120})/m) || msg.match(/^([^\n]{0,120})/m)
    const key = match ? match[1].trim() : "unknown"
    if (!categories[key]) categories[key] = new Set()
    categories[key].add(relName)
  }

  // Individual assertion failures
  for (const a of r.assertionResults) {
    if (a.status === "failed" && a.failureMessages) {
      for (const msg of a.failureMessages) {
        const match = msg.match(/^(\w+Error:? [^\n]{0,120})/m) || msg.match(/^([^\n]{0,120})/m)
        const key = match ? match[1].trim() : "unknown"
        if (!categories[key]) categories[key] = new Set()
        categories[key].add(relName)
      }
    }
  }
}

// Sort by count descending
const sorted = Object.entries(categories)
  .map(([err, files]) => [err, [...files]] as const)
  .sort((a, b) => b[1].length - a[1].length)

for (const [err, files] of sorted) {
  console.log(`--- (${files.length} files) ${err}`)
  for (const f of files.slice(0, 3)) {
    console.log(`    ${f}`)
  }
  if (files.length > 3) {
    console.log(`    ... and ${files.length - 3} more`)
  }
  console.log()
}
