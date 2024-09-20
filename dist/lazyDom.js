"use strict";
// Hierarchy: https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy
Object.defineProperty(exports, "__esModule", { value: true });
var Window_1 = require("./classes/Window");
var Document_1 = require("./classes/Document");
var HTMLDivElement_1 = require("./classes/elements/HTMLDivElement");
var HTMLCanvasElement_1 = require("./classes/elements/HTMLCanvasElement");
var EventTarget = /** @class */ (function () {
    function EventTarget() {
    }
    return EventTarget;
}());
var HTMLIFrameElement = /** @class */ (function () {
    function HTMLIFrameElement() {
    }
    return HTMLIFrameElement;
}());
var Navigator = /** @class */ (function () {
    function Navigator() {
    }
    return Navigator;
}());
var lazyDom = function () {
    console.log('*********************** called!');
    var window = new Window_1.Window();
    var document = new Document_1.Document();
    // document.defaultView = window
    var navigator = new Navigator();
    var instances = { document: document, window: window, navigator: navigator };
    var classes = { HTMLDivElement: HTMLDivElement_1.HTMLDivElement, HTMLIFrameElement: HTMLIFrameElement, EventTarget: EventTarget, HTMLCanvasElement: HTMLCanvasElement_1.HTMLCanvasElement };
    Object.assign(window, instances, classes);
    Object.assign(global, { window: window, document: document }, classes);
    console.log({ window: window });
    return { window: window, document: document, classes: classes };
};
exports.default = lazyDom;
