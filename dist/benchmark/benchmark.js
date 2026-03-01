"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tinybench_1 = require("tinybench");
const jsdom_1 = require("jsdom");
const lazyDom_1 = __importDefault(require("../lazyDom"));
const dom_removeChild_1 = require("./suite/dom.removeChild");
const react_createElement_1 = require("./suite/react.createElement");
const react_eventHandling_1 = require("./suite/react.eventHandling");
const react_createRoot_1 = require("./suite/react.createRoot");
const tldom_getByRole_1 = require("./suite/tldom.getByRole");
const dom_childNodeList_1 = require("./suite/dom.childNodeList");
const dom_documentElements_1 = require("./suite/dom.documentElements");
const dom_setAttribute_1 = require("./suite/dom.setAttribute");
const dom_textContent_1 = require("./suite/dom.textContent");
const dom_outerHTML_1 = require("./suite/dom.outerHTML");
const dom_bulkTreeConstruction_1 = require("./suite/dom.bulkTreeConstruction");
const react_deepRender_1 = require("./suite/react.deepRender");
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const bench = new tinybench_1.Bench({ time: 200 });
const lazyDomOptions = { beforeAll: () => { (0, lazyDom_1.default)(); } };
const JSDOMOptions = { beforeAll: () => {
        const dom = new jsdom_1.JSDOM(``, {
            url: "https://example.org/",
            referrer: "https://example.com/",
            contentType: "text/html",
            includeNodeLocations: true,
            storageQuota: 10000000
        });
        // @ts-expect-error TODO
        global.window = dom.window;
        global.document = dom.window.document;
    } };
bench
    .add('lazyDom: React.createRoot', react_createRoot_1.reactCreateRoot, lazyDomOptions)
    .add('JSDOM: React.createRoot', react_createRoot_1.reactCreateRoot, JSDOMOptions)
    .add('lazyDom: React.createRoot + React.createElement', react_createElement_1.reactCreateElement, lazyDomOptions)
    .add('JSDOM: React.createRoot + React.createElement', react_createElement_1.reactCreateElement, JSDOMOptions)
    .add('lazyDom: event handling', react_eventHandling_1.reactEventHandling, lazyDomOptions)
    .add('JSDOM: event handling', react_eventHandling_1.reactEventHandling, JSDOMOptions)
    .add('lazyDom: removing child', dom_removeChild_1.domRemoveChild, lazyDomOptions)
    .add('JSDOM: removing child', dom_removeChild_1.domRemoveChild, JSDOMOptions)
    .add('lazyDom: getByRole', tldom_getByRole_1.tldomGetByRole, lazyDomOptions)
    .add('JSDOM: getByRole', tldom_getByRole_1.tldomGetByRole, JSDOMOptions)
    .add('lazyDom: childNodes[i] access', dom_childNodeList_1.childNodeListIndexAccess, lazyDomOptions)
    .add('JSDOM: childNodes[i] access', dom_childNodeList_1.childNodeListIndexAccess, JSDOMOptions)
    .add('lazyDom: childNodes.forEach', dom_childNodeList_1.childNodeListIteration, lazyDomOptions)
    .add('JSDOM: childNodes.forEach', dom_childNodeList_1.childNodeListIteration, JSDOMOptions)
    .add('lazyDom: childNodes.length', dom_childNodeList_1.childNodeListLength, lazyDomOptions)
    .add('JSDOM: childNodes.length', dom_childNodeList_1.childNodeListLength, JSDOMOptions)
    .add('lazyDom: Array.from(childNodes)', dom_childNodeList_1.childNodeListArrayFrom, lazyDomOptions)
    .add('JSDOM: Array.from(childNodes)', dom_childNodeList_1.childNodeListArrayFrom, JSDOMOptions)
    .add('lazyDom: getElementById (depth-5 tree)', dom_documentElements_1.documentGetElementById, lazyDomOptions)
    .add('JSDOM: getElementById (depth-5 tree)', dom_documentElements_1.documentGetElementById, JSDOMOptions)
    .add('lazyDom: getElementsByTagNameNS (depth-5 tree)', dom_documentElements_1.documentGetElementsByTagNameNS, lazyDomOptions)
    .add('JSDOM: getElementsByTagNameNS (depth-5 tree)', dom_documentElements_1.documentGetElementsByTagNameNS, JSDOMOptions)
    .add('lazyDom: document.all (depth-5 tree)', dom_documentElements_1.documentAllLazyDom, lazyDomOptions)
    .add('JSDOM: querySelectorAll(*) (depth-5 tree)', dom_documentElements_1.documentAllJsdom, JSDOMOptions)
    // setAttribute thunk chain depth
    .add('lazyDom: setAttribute x10 + read', dom_setAttribute_1.setAttribute10, lazyDomOptions)
    .add('JSDOM: setAttribute x10 + read', dom_setAttribute_1.setAttribute10, JSDOMOptions)
    .add('lazyDom: setAttribute x50 + read', dom_setAttribute_1.setAttribute50, lazyDomOptions)
    .add('JSDOM: setAttribute x50 + read', dom_setAttribute_1.setAttribute50, JSDOMOptions)
    .add('lazyDom: setAttribute x100 + read', dom_setAttribute_1.setAttribute100, lazyDomOptions)
    .add('JSDOM: setAttribute x100 + read', dom_setAttribute_1.setAttribute100, JSDOMOptions)
    .add('lazyDom: setAttribute overwrite x50', dom_setAttribute_1.setAttributeOverwrite50, lazyDomOptions)
    .add('JSDOM: setAttribute overwrite x50', dom_setAttribute_1.setAttributeOverwrite50, JSDOMOptions)
    // textContent reading
    .add('lazyDom: textContent flat 100', dom_textContent_1.textContentFlat100, lazyDomOptions)
    .add('JSDOM: textContent flat 100', dom_textContent_1.textContentFlat100, JSDOMOptions)
    .add('lazyDom: textContent deep 20', dom_textContent_1.textContentDeep20, lazyDomOptions)
    .add('JSDOM: textContent deep 20', dom_textContent_1.textContentDeep20, JSDOMOptions)
    .add('lazyDom: textContent mixed 50', dom_textContent_1.textContentMixed, lazyDomOptions)
    .add('JSDOM: textContent mixed 50', dom_textContent_1.textContentMixed, JSDOMOptions)
    // DOM serialization (outerHTML / innerHTML)
    .add('lazyDom: outerHTML wide (100 children)', dom_outerHTML_1.outerHTMLWideTree, lazyDomOptions)
    .add('JSDOM: outerHTML wide (100 children)', dom_outerHTML_1.outerHTMLWideTree, JSDOMOptions)
    .add('lazyDom: outerHTML deep (20 levels)', dom_outerHTML_1.outerHTMLDeepTree, lazyDomOptions)
    .add('JSDOM: outerHTML deep (20 levels)', dom_outerHTML_1.outerHTMLDeepTree, JSDOMOptions)
    .add('lazyDom: outerHTML realistic (~70 elements)', dom_outerHTML_1.outerHTMLRealisticTree, lazyDomOptions)
    .add('JSDOM: outerHTML realistic (~70 elements)', dom_outerHTML_1.outerHTMLRealisticTree, JSDOMOptions)
    .add('lazyDom: innerHTML (50 spans)', dom_outerHTML_1.innerHTMLContainer, lazyDomOptions)
    .add('JSDOM: innerHTML (50 spans)', dom_outerHTML_1.innerHTMLContainer, JSDOMOptions)
    // Bulk tree construction (no reading)
    .add('lazyDom: bulk tree ~50 elements', dom_bulkTreeConstruction_1.bulkTreeSmall, lazyDomOptions)
    .add('JSDOM: bulk tree ~50 elements', dom_bulkTreeConstruction_1.bulkTreeSmall, JSDOMOptions)
    .add('lazyDom: bulk tree ~100 elements', dom_bulkTreeConstruction_1.bulkTreeMedium, lazyDomOptions)
    .add('JSDOM: bulk tree ~100 elements', dom_bulkTreeConstruction_1.bulkTreeMedium, JSDOMOptions)
    .add('lazyDom: bulk tree ~200 elements', dom_bulkTreeConstruction_1.bulkTreeLarge, lazyDomOptions)
    .add('JSDOM: bulk tree ~200 elements', dom_bulkTreeConstruction_1.bulkTreeLarge, JSDOMOptions)
    // React deep render with nested providers
    .add('lazyDom: React deep render (6 providers)', react_deepRender_1.reactDeepRender, lazyDomOptions)
    .add('JSDOM: React deep render (6 providers)', react_deepRender_1.reactDeepRender, JSDOMOptions)
    .add('lazyDom: React deep render + snapshot', react_deepRender_1.reactDeepRenderWithSnapshot, lazyDomOptions)
    .add('JSDOM: React deep render + snapshot', react_deepRender_1.reactDeepRenderWithSnapshot, JSDOMOptions)
    .add('lazyDom: React deep render + rerender', react_deepRender_1.reactDeepRenderRerender, lazyDomOptions)
    .add('JSDOM: React deep render + rerender', react_deepRender_1.reactDeepRenderRerender, JSDOMOptions);
const main = async () => {
    await bench.warmup();
    await bench.run();
    console.table(bench.table());
};
main();
