"use strict";
// Synchronous WASM instantiation using @assemblyscript/loader
// Synchronous loading is required because DOM classes are used at import time.
Object.defineProperty(exports, "__esModule", { value: true });
exports.wasm = void 0;
const loader_1 = require("@assemblyscript/loader");
const fs_1 = require("fs");
const path_1 = require("path");
// Find the WASM file relative to this source file
// In development (tsx), __dirname points to src/wasm/
// The WASM binary is at build/wasm/lazy-dom.wasm from project root
function findWasmPath() {
    // Try multiple potential locations
    const candidates = [
        (0, path_1.resolve)(__dirname, "../../build/wasm/lazy-dom.wasm"), // from src/wasm/ (dev via tsx)
        (0, path_1.resolve)(__dirname, "../build/wasm/lazy-dom.wasm"), // from dist/wasm/ (compiled)
        (0, path_1.resolve)(process.cwd(), "build/wasm/lazy-dom.wasm"), // cwd fallback
        (0, path_1.resolve)(process.cwd(), "node_modules/lazy-dom/build/wasm/lazy-dom.wasm"),
    ];
    for (const candidate of candidates) {
        try {
            (0, fs_1.readFileSync)(candidate);
            return candidate;
        }
        catch {
            // try next
        }
    }
    return candidates[1]; // default to cwd-relative path
}
const wasmPath = findWasmPath();
const wasmBuffer = (0, fs_1.readFileSync)(wasmPath);
const wasmInstance = (0, loader_1.instantiateSync)(wasmBuffer, {
    env: {
        abort(msgPtr, filePtr, line, column) {
            const msg = msgPtr ? exports.wasm.__getString(msgPtr) : "unknown";
            const file = filePtr ? exports.wasm.__getString(filePtr) : "unknown";
            throw new Error(`WASM abort: ${msg} at ${file}:${line}:${column}`);
        },
    },
});
exports.wasm = wasmInstance.exports;
