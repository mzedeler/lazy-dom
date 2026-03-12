const fs = require("fs");
const path = require("path");

const label = process.env.HEAP_SNAPSHOT_LABEL || "unknown";
const outDir = process.env.HEAP_SNAPSHOT_DIR || process.cwd();

let suiteCount = 0;
const memoryLog = [];

module.exports = async function globalSetup() {
  if (global.gc) {
    global.gc();
    await new Promise((resolve) => setTimeout(resolve, 100));
    global.gc();
  }

  const mem = process.memoryUsage();
  const memFile = path.join(outDir, `${label}-before-memory.json`);
  fs.writeFileSync(memFile, JSON.stringify(mem));

  // Track memory growth during the run
  global.__memoryTracker = {
    recordSuite() {
      suiteCount++;
      if (suiteCount % 25 === 0) {
        if (global.gc) global.gc();
        const m = process.memoryUsage();
        const entry = { suite: suiteCount, heapUsed: m.heapUsed, rss: m.rss };
        memoryLog.push(entry);
        process.stderr.write(
          `[memory-track] suite=${suiteCount} heapUsed=${Math.round(m.heapUsed/1024/1024)}MB rss=${Math.round(m.rss/1024/1024)}MB\n`
        );
      }
    },
    getLog() { return memoryLog; },
  };
};
