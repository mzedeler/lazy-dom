const NodeEnvironment = require('jest-environment-node');
const stubs = require('./stubs');

class LazyDomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // Initialize lazyDom — creates window, document, and DOM classes
    const lazyDom = require('lazy-dom').default;
    const { window, document, classes } = lazyDom();

    // Assign DOM globals to Jest's VM context
    Object.assign(this.global, { window, document }, classes);

    // Navigator (React checks navigator.userAgent at import time)
    const navigator = {
      userAgent: `Node.js/${process.versions.node}`,
    };
    this.global.navigator = navigator;
    window.navigator = navigator;

    // React-specific flags
    this.global.IS_REACT_ACT_ENVIRONMENT = true;
    this.global.__LAZY_DOM__ = true;

    // Install stubs for APIs lazyDom doesn't implement yet
    stubs.install(this.global);
  }
}

module.exports = LazyDomEnvironment;
