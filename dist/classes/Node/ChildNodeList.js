"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildNodeList = void 0;
const NodeList_1 = require("../NodeList");
class ChildNodeList extends NodeList_1.NodeList {
    nodeStore;
    constructor(nodeStore) {
        super();
        this.nodeStore = nodeStore;
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    if (!isNaN(index) && index >= 0) {
                        return target.nodeStore.getChildNode(index);
                    }
                }
                return Reflect.get(target, prop, receiver);
            },
            has(target, prop) {
                if (typeof prop === 'string') {
                    const index = Number(prop);
                    if (!isNaN(index) && index >= 0) {
                        return index < target.nodeStore.getChildCount();
                    }
                }
                return Reflect.has(target, prop);
            },
        });
    }
    get length() {
        return this.nodeStore.getChildCount();
    }
    item(index) {
        return this.nodeStore.getChildNode(index) ?? null;
    }
    forEach(callback) {
        const children = this.nodeStore.getChildNodesArray();
        for (let i = 0; i < children.length; i++) {
            callback(children[i], i, this);
        }
        return undefined;
    }
    keys() {
        return this.nodeStore.getChildNodesArray().map((_, i) => i).values();
    }
    entries() {
        return this.nodeStore.getChildNodesArray().map((node, i) => [i, node]).values();
    }
    values() {
        return this.nodeStore.getChildNodesArray().values();
    }
    [Symbol.iterator]() {
        return this.nodeStore.getChildNodesArray().values();
    }
}
exports.ChildNodeList = ChildNodeList;
