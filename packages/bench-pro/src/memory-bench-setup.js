const v8 = require("v8");
const fs = require("fs");
const path = require("path");

const label = process.env.HEAP_SNAPSHOT_LABEL || "unknown";
const outDir = process.env.HEAP_SNAPSHOT_DIR || process.cwd();

module.exports = async function globalSetup() {
  if (global.gc) {
    global.gc();
    await new Promise((resolve) => setTimeout(resolve, 100));
    global.gc();
  }

  const mem = process.memoryUsage();
  const memFile = path.join(outDir, `${label}-before-memory.json`);
  fs.writeFileSync(memFile, JSON.stringify(mem));

  const snapshotFile = path.join(outDir, `${label}-before.heapsnapshot`);
  v8.writeHeapSnapshot(snapshotFile);
  // Write to stderr to avoid contaminating Jest's --json stdout
  process.stderr.write(`Heap snapshot (before): ${snapshotFile}\n`);
};
