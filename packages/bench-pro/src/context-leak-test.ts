/**
 * Diagnostic: does LazyDomEnvironment leak vm contexts?
 *
 * Tests three scenarios with increasing complexity:
 * 1. Basic environment create+teardown
 * 2. Code executed inside vm context
 * 3. Full module compilation inside vm context (simulate Jest module loading)
 *
 * Run with: node --expose-gc -e "require('tsx/cjs'); require('./src/context-leak-test.ts')"
 * from packages/bench-pro/
 */
import vm from "vm"
import type { JestEnvironmentConfig } from "@jest/environment"
import LazyDomEnvironment from "../../jest-environment-lazy-dom/src/index"

// Track context creation/finalization
const tracker = { created: 0, finalized: 0 }
const registry = new FinalizationRegistry(() => { tracker.finalized++ })

const origCreateContext = vm.createContext
vm.createContext = function (...args: Parameters<typeof vm.createContext>) {
  const ctx = origCreateContext.apply(this, args)
  tracker.created++
  registry.register(ctx, undefined)
  return ctx
} as typeof vm.createContext

const config: JestEnvironmentConfig = {
  globalConfig: {} as JestEnvironmentConfig["globalConfig"],
  projectConfig: {
    globals: {},
    testEnvironmentOptions: {},
  } as JestEnvironmentConfig["projectConfig"],
}
const envContext = { console, testPath: "", docblockPragmas: {} }

// Simulate a complex module system inside the vm context
const moduleCode = `
(function() {
  // Simulate a module system with require-like closures
  var modules = {};
  var moduleCache = {};

  function require(id) {
    if (moduleCache[id]) return moduleCache[id].exports;
    var mod = { exports: {} };
    moduleCache[id] = mod;
    modules[id](mod, mod.exports, require);
    return mod.exports;
  }

  // "React-like" module with internal state
  modules['react'] = function(module, exports, require) {
    var currentFiber = null;
    var workInProgress = null;
    var hookIndex = 0;
    var hooks = [];

    exports.createElement = function(type, props) {
      var children = Array.prototype.slice.call(arguments, 2);
      return { type: type, props: props || {}, children: children };
    };

    exports.useState = function(initial) {
      var idx = hookIndex++;
      if (hooks[idx] === undefined) hooks[idx] = initial;
      var setterIdx = idx;
      return [hooks[idx], function(val) { hooks[setterIdx] = val; }];
    };

    exports.render = function(vdom, container) {
      if (typeof vdom.type === 'string') {
        var el = document.createElement(vdom.type);
        if (vdom.props) {
          Object.keys(vdom.props).forEach(function(k) {
            if (k.startsWith('on')) {
              el.addEventListener(k.slice(2).toLowerCase(), vdom.props[k]);
            } else {
              el.setAttribute(k, vdom.props[k]);
            }
          });
        }
        vdom.children.forEach(function(child) {
          if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
          } else if (child) {
            exports.render(child, el);
          }
        });
        container.appendChild(el);
        return el;
      }
    };

    exports.cleanup = function() {
      currentFiber = null;
      workInProgress = null;
      hooks = [];
      hookIndex = 0;
    };
  };

  // "testing-library-like" module
  modules['testing-lib'] = function(module, exports, require) {
    var React = require('react');

    exports.render = function(vdom) {
      var container = document.createElement('div');
      document.body.appendChild(container);
      React.render(vdom, container);
      return {
        container: container,
        getByText: function(text) {
          return container.querySelector('*');
        },
        unmount: function() {
          container.innerHTML = '';
          container.remove();
        }
      };
    };

    exports.fireEvent = {
      click: function(el) {
        var ev = new Event('click', { bubbles: true });
        el.dispatchEvent(ev);
      }
    };
  };

  // Run "tests"
  var React = require('react');
  var lib = require('testing-lib');

  for (var t = 0; t < 5; t++) {
    var vdom = React.createElement('div', { class: 'test-' + t, onClick: function() {} },
      React.createElement('span', null, 'hello ' + t),
      React.createElement('button', { onClick: function() {} }, 'click me')
    );
    var result = lib.render(vdom);
    if (result.container) {
      lib.fireEvent.click(result.container.querySelector('button') || result.container);
    }
    result.unmount();
  }

  // Simulate module-level closures that capture document/window
  var cachedDocument = document;
  var cachedWindow = window;
  var pendingCallbacks = [
    function() { return cachedDocument.body; },
    function() { return cachedWindow.innerWidth; },
  ];

  // Simulate MutationObserver usage
  if (typeof MutationObserver === 'function') {
    var observer = new MutationObserver(function() {});
    observer.observe(document.body, { childList: true });
    observer.disconnect();
  }

  // Clear module state (simulating what jest-runtime teardown does)
  modules = null;
  moduleCache = null;
})();
`

async function runScenario(
  label: string,
  N: number,
  setupFn: (env: LazyDomEnvironment) => void,
) {
  tracker.created = 0
  tracker.finalized = 0

  console.log(`\n--- ${label} (${N} iterations) ---`)

  for (let i = 0; i < N; i++) {
    const env = new LazyDomEnvironment(config, envContext)
    await env.setup()
    setupFn(env)
    await env.teardown()

    if ((i + 1) % 25 === 0) {
      globalThis.gc!()
      await new Promise(r => setTimeout(r, 50))
    }
  }

  // Final GC
  for (let pass = 0; pass < 10; pass++) {
    globalThis.gc!()
    await new Promise(r => setTimeout(r, 100))
  }

  const retained = tracker.created - tracker.finalized
  const mem = process.memoryUsage()
  console.log(
    `  Result: created=${tracker.created} finalized=${tracker.finalized} ` +
    `retained=${retained} (${((retained / tracker.created) * 100).toFixed(1)}%) ` +
    `heap=${Math.round(mem.heapUsed / 1024 / 1024)}MB`
  )
}

async function run() {
  if (!globalThis.gc) {
    console.error("Run with --expose-gc")
    process.exit(1)
  }

  const N = parseInt(process.argv[2] || "100", 10)

  // Scenario 1: basic create+teardown
  await runScenario("Basic create+teardown", N, () => {})

  // Scenario 2: simple in-vm code
  await runScenario("Simple in-vm DOM ops", N, (env) => {
    const ctx = env.getVmContext()
    if (ctx) {
      vm.runInContext(`
        var d = document.createElement('div');
        d.addEventListener('click', function(){});
        document.body.appendChild(d);
      `, ctx)
    }
  })

  // Scenario 3: complex module simulation
  await runScenario("Complex module simulation", N, (env) => {
    const ctx = env.getVmContext()
    if (ctx) {
      vm.runInContext(moduleCode, ctx)
    }
  })

  // Scenario 4: module code with uncleaned closures (don't null modules)
  const leakyModuleCode = moduleCode.replace(
    "modules = null;\n  moduleCache = null;",
    "// NOT cleaning up module references"
  )
  await runScenario("Module sim WITH persistent refs", N, (env) => {
    const ctx = env.getVmContext()
    if (ctx) {
      vm.runInContext(leakyModuleCode, ctx)
    }
  })
}

run().catch(console.error)
