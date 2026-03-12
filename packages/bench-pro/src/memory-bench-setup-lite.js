const vm = require("vm");
const fs = require("fs");
const path = require("path");

const label = process.env.HEAP_SNAPSHOT_LABEL || "unknown";
const outDir = process.env.HEAP_SNAPSHOT_DIR || process.cwd();

// Monkey-patch vm.createContext to track context creation and collection
const _origCreateContext = vm.createContext;
const _ctxTracker = {
  created: 0,
  finalized: 0,
  suites: [],       // Array of suite paths in creation order
  finalizedSet: new Set(), // Indices of finalized contexts
  registry: new FinalizationRegistry((idx) => {
    _ctxTracker.finalized++;
    _ctxTracker.finalizedSet.add(idx);
  }),
};
vm.createContext = function(sandbox, options) {
  const ctx = _origCreateContext.call(this, sandbox, options);
  const idx = _ctxTracker.created++;
  _ctxTracker.registry.register(ctx, idx);
  return ctx;
};
process.__vmContextTracker = _ctxTracker;

module.exports = async function globalSetup() {
  if (global.gc) {
    global.gc();
    await new Promise((resolve) => setTimeout(resolve, 100));
    global.gc();
  }

  const mem = process.memoryUsage();
  const memFile = path.join(outDir, `${label}-before-memory.json`);
  fs.writeFileSync(memFile, JSON.stringify(mem));
};
