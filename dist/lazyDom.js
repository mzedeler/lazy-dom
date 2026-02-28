"use strict";
// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSDOM = void 0;
const Window_1 = require("./classes/Window");
const Document_1 = require("./classes/Document");
const Node_1 = require("./classes/Node");
const Element_1 = require("./classes/Element");
const Text_1 = require("./classes/Text");
const Comment_1 = require("./classes/Comment");
const DocumentFragment_1 = require("./classes/DocumentFragment");
const CharacterData_1 = require("./classes/CharacterData");
const Attr_1 = require("./classes/Attr");
const NamedNodeMap_1 = require("./classes/NamedNodeMap");
const DOMException_1 = require("./classes/DOMException");
const HTMLCollection_1 = require("./classes/HTMLCollection");
const NodeList_1 = require("./classes/NodeList");
const HTMLElement_1 = require("./classes/elements/HTMLElement");
const HTMLDivElement_1 = require("./classes/elements/HTMLDivElement");
const HTMLCanvasElement_1 = require("./classes/elements/HTMLCanvasElement");
const HTMLLIElement_1 = require("./classes/elements/HTMLLIElement");
const HTMLSpanElement_1 = require("./classes/elements/HTMLSpanElement");
const HTMLInputElement_1 = require("./classes/elements/HTMLInputElement");
const HTMLButtonElement_1 = require("./classes/elements/HTMLButtonElement");
const HTMLFormElement_1 = require("./classes/elements/HTMLFormElement");
const HTMLAnchorElement_1 = require("./classes/elements/HTMLAnchorElement");
const HTMLImageElement_1 = require("./classes/elements/HTMLImageElement");
const SVGElement_1 = require("./classes/elements/SVGElement");
const HTMLIFrameElement_1 = require("./classes/elements/HTMLIFrameElement");
var jsdom_1 = require("./jsdom");
Object.defineProperty(exports, "JSDOM", { enumerable: true, get: function () { return jsdom_1.JSDOM; } });
class Navigator {
}
const lazyDom = () => {
    const window = new Window_1.Window();
    const document = new Document_1.Document();
    document.defaultView = window;
    const navigator = new Navigator();
    const instances = { document, window, navigator };
    const classes = {
        Node: Node_1.Node,
        Element: Element_1.Element,
        Text: Text_1.Text,
        Comment: Comment_1.Comment,
        DocumentFragment: DocumentFragment_1.DocumentFragment,
        CharacterData: CharacterData_1.CharacterData,
        Attr: Attr_1.Attr,
        NamedNodeMap: NamedNodeMap_1.NamedNodeMap,
        DOMException: DOMException_1.DOMException,
        HTMLCollection: HTMLCollection_1.HTMLCollection,
        NodeList: NodeList_1.NodeList,
        EventTarget: globalThis.EventTarget,
        HTMLElement: HTMLElement_1.HTMLElement,
        HTMLDivElement: HTMLDivElement_1.HTMLDivElement,
        HTMLLIElement: HTMLLIElement_1.HTMLLIElement,
        HTMLIFrameElement: HTMLIFrameElement_1.HTMLIFrameElement,
        HTMLCanvasElement: HTMLCanvasElement_1.HTMLCanvasElement,
        HTMLSpanElement: HTMLSpanElement_1.HTMLSpanElement,
        HTMLInputElement: HTMLInputElement_1.HTMLInputElement,
        HTMLButtonElement: HTMLButtonElement_1.HTMLButtonElement,
        HTMLFormElement: HTMLFormElement_1.HTMLFormElement,
        HTMLAnchorElement: HTMLAnchorElement_1.HTMLAnchorElement,
        HTMLImageElement: HTMLImageElement_1.HTMLImageElement,
        SVGElement: SVGElement_1.SVGElement,
    };
    Object.assign(window, instances, classes);
    Object.assign(global, { window, document }, classes);
    return { window, document, classes };
};
exports.default = lazyDom;
