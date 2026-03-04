/**
 * Regression test for cross-test requestAnimationFrame frame loop corruption.
 *
 * Simulates the pattern used by motion v12's frame loop: a module-level
 * `runNextFrame` flag guards whether `wake()` calls `requestAnimationFrame`.
 * If the environment cancels pending RAF timers between tests, the flag stays
 * stale and the frame loop dies silently.
 */

// --- Simulated frame loop (mirrors motion-dom's batcher.mjs) ---

let runNextFrame = false

const scheduleNextBatch = (cb: () => void) => {
  requestAnimationFrame(() => cb())
}

type StepCallback = () => void
const pendingSteps: StepCallback[] = []

const processBatch = () => {
  runNextFrame = false
  // Drain all pending steps (mirrors motion's step processing)
  const steps = pendingSteps.splice(0)
  for (const step of steps) step()
  // If new work was scheduled during processing, keep the loop alive.
  if (runNextFrame) scheduleNextBatch(processBatch)
}

const wake = () => {
  runNextFrame = true
  scheduleNextBatch(processBatch)
}

const schedule = (cb: StepCallback) => {
  if (!runNextFrame) wake()
  pendingSteps.push(cb)
}

// --- Tests ---

test("first test: schedule work that leaves a pending RAF", (done) => {
  schedule(() => {
    // This step fires when the first processBatch runs.
    // Meanwhile, schedule more work so runNextFrame stays true and a new
    // RAF is queued. The test ends before that second RAF fires.
  })

  // Wait for the first processBatch to run (~16ms RAF delay), then schedule
  // more work to leave a pending RAF with runNextFrame = true.
  setTimeout(() => {
    schedule(() => {})
    // End the test with a pending RAF — processBatch has not yet run for
    // this second batch.
    done()
  }, 50)
})

test("second test: frame loop must still be functional", (done) => {
  let callbackFired = false

  schedule(() => {
    callbackFired = true
  })

  // Give the RAF time to fire (16ms delay + margin)
  setTimeout(() => {
    expect(callbackFired).toBe(true)
    done()
  }, 200)
})
