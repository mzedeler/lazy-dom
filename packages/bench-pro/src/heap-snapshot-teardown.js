const v8 = require("v8");
const path = require("path");

const label = process.env.HEAP_SNAPSHOT_LABEL || "unknown";
const outDir = process.env.HEAP_SNAPSHOT_DIR || "/tmp";

module.exports = async function globalTeardown() {
  if (global.gc) {
    global.gc();
    // Allow weak refs to be cleared
    await new Promise((resolve) => setTimeout(resolve, 100));
    global.gc();
  }

  const filename = path.join(outDir, `heap-${label}.heapsnapshot`);
  v8.writeHeapSnapshot(filename);
  console.log(`\nHeap snapshot written to: ${filename}`);
};
