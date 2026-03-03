import { ErrorEvent } from "../classes/ErrorEvent"

interface WindowLike {
  dispatchEvent(event: { defaultPrevented: boolean }): boolean
  console: { error(...args: unknown[]): void }
}

/**
 * Dispatch an error to a window as an ErrorEvent. If the event is not
 * preventDefault()'d, log it to console.error like browsers do for
 * uncaught errors in event handlers.
 */
export function dispatchErrorToWindow(
  getWindow: () => WindowLike | null | undefined,
  err: unknown,
): void {
  try {
    const win = getWindow()
    if (win) {
      const errObj = err as { message?: string }
      const message = (typeof errObj?.message === 'string') ? errObj.message : String(err)
      const errorEvent = new ErrorEvent('error', {
        message,
        error: err,
        cancelable: true,
      })
      const handled = !win.dispatchEvent(errorEvent)
      if (!handled) {
        win.console.error(`Error: Uncaught [${err}]`, err)
      }
    }
  } catch {
    // If window dispatch fails, silently swallow
  }
}
