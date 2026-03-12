const fs = require("fs");
const path = require("path");

const label = process.env.HEAP_SNAPSHOT_LABEL || "unknown";
const outDir = process.env.HEAP_SNAPSHOT_DIR || process.cwd();

module.exports = async function globalTeardown() {
  // Aggressive GC: multiple rounds with event loop yields
  if (global.gc) {
    for (let i = 0; i < 5; i++) {
      global.gc();
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  // Report vm context tracking
  const tracker = process.__vmContextTracker;
  if (tracker) {
    const retained = tracker.created - tracker.finalized;
    process.stderr.write(`[vm-ctx] ${label}: created=${tracker.created} finalized=${tracker.finalized} retained=${retained}\n`);
    // Report which suites retained their contexts
    if (retained > 0 && tracker.suites.length > 0) {
      process.stderr.write(`[vm-ctx] Retained suites:\n`);
      for (let i = 0; i < tracker.suites.length; i++) {
        if (!tracker.finalizedSet.has(i)) {
          process.stderr.write(`[vm-ctx]   #${i}: ${tracker.suites[i]}\n`);
        }
      }
    }
  }

  const mem = process.memoryUsage();
  const memFile = path.join(outDir, `${label}-after-memory.json`);
  fs.writeFileSync(memFile, JSON.stringify(mem));
  // No heap snapshots — just memory JSON
};
