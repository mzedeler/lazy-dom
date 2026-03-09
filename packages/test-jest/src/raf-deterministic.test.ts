/**
 * Tests for the deterministic requestAnimationFrame model in
 * jest-environment-lazy-dom.
 *
 * The key behavior: when a NEW requestAnimationFrame is registered, all
 * PREVIOUSLY registered callbacks fire synchronously.  This avoids
 * wall-clock timing flakiness under CPU contention from parallel workers.
 *
 * A fallback timer (32ms) also fires callbacks for single-rAF scenarios.
 */

describe('requestAnimationFrame deterministic firing', () => {
  it('does not fire a callback immediately on registration', () => {
    let called = false
    requestAnimationFrame(() => { called = true })
    expect(called).toBe(false)
  })

  it('fires previous callback synchronously when a new rAF is registered', () => {
    const calls: number[] = []

    requestAnimationFrame(() => { calls.push(1) })
    expect(calls).toEqual([])

    requestAnimationFrame(() => { calls.push(2) })
    // Callback 1 should have fired synchronously during registration of 2
    expect(calls).toEqual([1])
  })

  it('fires multiple previous callbacks when a new rAF is registered', () => {
    // Register two callbacks without triggering a third
    const calls: number[] = []

    requestAnimationFrame(() => { calls.push(1) })
    // Register callback 2 — callback 1 fires
    requestAnimationFrame(() => { calls.push(2) })
    expect(calls).toEqual([1])

    // Register callback 3 — callback 2 fires
    requestAnimationFrame(() => { calls.push(3) })
    expect(calls).toEqual([1, 2])
  })

  it('does not fire a cancelled callback', () => {
    let called = false
    const id = requestAnimationFrame(() => { called = true })

    cancelAnimationFrame(id)

    // Register another — the cancelled one should NOT fire
    requestAnimationFrame(() => {})
    expect(called).toBe(false)
  })

  it('passes a numeric timestamp to the callback', (done) => {
    requestAnimationFrame((timestamp) => {
      expect(typeof timestamp).toBe('number')
      expect(timestamp).toBeGreaterThan(0)
      done()
    })
    // Trigger the callback via a new registration
    requestAnimationFrame(() => {})
  })

  it('callback fires via fallback timer when no subsequent rAF is registered', (done) => {
    const start = performance.now()

    requestAnimationFrame(() => {
      const elapsed = performance.now() - start
      // Should fire within ~32ms (the fallback timer), not immediately
      expect(elapsed).toBeGreaterThanOrEqual(10)
      done()
    })
    // No subsequent requestAnimationFrame — fallback timer fires the callback
  })
})

describe('requestAnimationFrame scroll-position pattern', () => {
  // This test replicates the exact pattern that caused flakiness with the
  // old setInterval-based approach: two clicks in sequence where each
  // registers a rAF, and the test asserts between them.

  it('rAF from first action fires only when second action registers its own rAF', () => {
    const scrollToCalls: Array<[number, number]> = []
    const mockScrollTo = (x: number, y: number) => scrollToCalls.push([x, y])

    // Simulate: click overlay tab → component calls requestAnimationFrame
    requestAnimationFrame(() => {
      mockScrollTo(0, 300)
    })

    // Assertion between clicks: scrollTo should NOT have been called yet
    expect(scrollToCalls).toEqual([])

    // Simulate: click page tab → component calls requestAnimationFrame
    // This triggers the previous callback synchronously
    requestAnimationFrame(() => {
      mockScrollTo(0, 300)
    })

    // Assertion after second click: scrollTo should have been called
    expect(scrollToCalls).toEqual([[0, 300]])
  })
})
