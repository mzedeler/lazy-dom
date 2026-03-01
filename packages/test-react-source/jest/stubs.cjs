function install(global) {
  // MutationObserver (React uses internally for some features)
  if (!global.MutationObserver) {
    global.MutationObserver = class MutationObserver {
      constructor() {}
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  }

  // requestAnimationFrame / cancelAnimationFrame
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
    global.cancelAnimationFrame = (id) => clearTimeout(id);
  }

  // getComputedStyle (React DOM reads this for transitions/animations)
  if (!global.getComputedStyle) {
    global.getComputedStyle = () => new Proxy({}, {
      get: () => '',
    });
  }

  // window.getSelection (used by some React DOM tests)
  if (!global.window || !global.window.getSelection) {
    const sel = { addRange() {}, removeAllRanges() {}, rangeCount: 0 };
    if (global.window) global.window.getSelection = () => sel;
  }

  // Range (needed by selection-related tests)
  if (!global.Range) {
    global.Range = class Range {
      setStart() {} setEnd() {}
      getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
      getClientRects() { return []; }
    };
  }
}

module.exports = { install };
