import { describe, it } from "node:test"
import assert from "node:assert"
import LazyDomEnvironment from "./index"
import type { JestEnvironmentConfig } from "@jest/environment"

// Minimal config matching what Jest passes to the environment
const config: JestEnvironmentConfig = {
  globalConfig: {} as JestEnvironmentConfig["globalConfig"],
  projectConfig: {
    globals: {},
    testEnvironmentOptions: {},
  } as JestEnvironmentConfig["projectConfig"],
}

const envContext = { console, testPath: "", docblockPragmas: {} }

describe("LazyDomEnvironment", () => {
  describe("teardown", () => {
    it("cancels pending setTimeout callbacks so they do not fire after global is stripped", async () => {
      const env = new LazyDomEnvironment(config, envContext)
      await env.setup()

      // Simulate what @rails/activestorage does: a deferred timer
      // that accesses `window` on the context global.
      const g = env.global as typeof globalThis
      let callbackFired = false

      // Schedule a timer through the context's setTimeout (the one test code uses)
      g.setTimeout(() => {
        callbackFired = true
      }, 10)

      await env.teardown()

      // Wait for the timer to (potentially) fire
      await new Promise((resolve) => setTimeout(resolve, 50))

      // The timer should have been cancelled — the callback should never run
      assert.strictEqual(callbackFired, false, "setTimeout callback should not fire after teardown")
    })

    it("cancels pending setInterval callbacks on teardown", async () => {
      const env = new LazyDomEnvironment(config, envContext)
      await env.setup()

      const g = env.global as typeof globalThis
      let callCount = 0

      g.setInterval(() => {
        callCount++
      }, 5)

      // Let the interval fire a couple of times
      await new Promise((resolve) => setTimeout(resolve, 20))
      const countBeforeTeardown = callCount

      await env.teardown()

      // Wait and verify the interval stopped
      await new Promise((resolve) => setTimeout(resolve, 50))
      assert.strictEqual(callCount, countBeforeTeardown, "setInterval callback should not fire after teardown")
    })

    it("cancels pending setImmediate callbacks on teardown", async () => {
      const env = new LazyDomEnvironment(config, envContext)
      await env.setup()

      const g = env.global as typeof globalThis
      let callbackFired = false

      // React's scheduler uses setImmediate for performWorkUntilDeadline,
      // which accesses window.event. If not cancelled, this crashes the
      // worker after teardown strips the global.
      g.setImmediate(() => {
        callbackFired = true
      })

      await env.teardown()

      // Wait for the immediate to (potentially) fire
      await new Promise((resolve) => setTimeout(resolve, 50))

      assert.strictEqual(callbackFired, false, "setImmediate callback should not fire after teardown")
    })
  })
})
