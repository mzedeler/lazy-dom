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
    stdio: ["pipe", "pipe", "pipe"],
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

const data: { testResults: TestResult[] } = JSON.parse(json)
const failed = data.testResults.filter((r) => r.status === "failed")
const passed = data.testResults.filter((r) => r.status === "passed")

console.log(`Passed: ${passed.length} / Failed: ${failed.length} / Total: ${data.testResults.length}\n`)

// Categorize by root cause
const cats: Record<string, string[]> = {}

function categorize(msg: string): string {
  let m = msg.match(/ReferenceError: (\S+) is not defined/)
  if (m) return `Missing global: ${m[1]}`

  m = msg.match(/TypeError: (\S+) is not a constructor/)
  if (m) return `Not a constructor: ${m[1]}`

  m = msg.match(/TypeError: (\S+) is not a function/)
  if (m) return `Not a function: ${m[1]}`

  m = msg.match(/TypeError: Cannot read properties of (\S+) \(reading '(\S+)'\)/)
  if (m) return `Cannot read '${m[2]}' of ${m[1]}`

  m = msg.match(/TypeError: Cannot destructure property '(\S+)' of '([^']+)'/)
  if (m) return `Cannot destructure '${m[1]}' of ${m[2]}`

  m = msg.match(/toHaveTextContent/)
  if (m) return "toHaveTextContent matcher failure"

  m = msg.match(/toHaveStyle/)
  if (m) return "toHaveStyle matcher failure"

  m = msg.match(/toHaveAttribute/)
  if (m) return "toHaveAttribute matcher failure"

  m = msg.match(/toMatchSnapshot/)
  if (m) return "Snapshot mismatch"

  m = msg.match(/Exceeded timeout/)
  if (m) return "Test timeout (likely from MutationObserver)"

  m = msg.match(/Unable to find/)
  if (m) return "testing-library: Unable to find element"

  m = msg.match(/Attribute selector didn't terminate/)
  if (m) return "CSS selector parse error"

  return "other"
}

for (const r of failed) {
  const relName = r.name.replace(/.*pro\//, "")

  if (r.testExecError) {
    const key = categorize(r.testExecError.message)
    if (!cats[key]) cats[key] = []
    cats[key].push(relName)
    continue
  }

  // Use the first failing assertion's first message
  const firstFail = r.assertionResults.find((a) => a.status === "failed")
  if (firstFail && firstFail.failureMessages.length > 0) {
    const key = categorize(firstFail.failureMessages[0])
    if (!cats[key]) cats[key] = []
    cats[key].push(relName)
  } else {
    if (!cats["other"]) cats["other"] = []
    cats["other"].push(relName)
  }
}

const sorted = Object.entries(cats).sort((a, b) => b[1].length - a[1].length)

for (const [cause, files] of sorted) {
  console.log(`${files.length} suites: ${cause}`)
  for (const f of files.slice(0, 3)) {
    console.log(`  ${f}`)
  }
  if (files.length > 3) {
    console.log(`  ... and ${files.length - 3} more`)
  }
  console.log()
}
