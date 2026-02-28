"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssSelectAdapter = void 0;
const CssSelectTypes_1 = require("../types/CssSelectTypes");
const NodeTypes_1 = require("../types/NodeTypes");
class CssSelectAdapter {
    isTag(node) {
        return (0, CssSelectTypes_1.isCssElement)(node);
    }
    getChildren(node) {
        return Array.from(node.childNodes);
    }
    getParent(node) {
        const parent = node.parentNode;
        return (0, CssSelectTypes_1.isCssNode)(parent) ? parent : null;
    }
    getNodeParent(node) {
        if ('parentNode' in node) {
            const parent = node.parentNode;
            return (0, CssSelectTypes_1.isCssNode)(parent) ? parent : null;
        }
        return null;
    }
    removeSubsets(inputNodes) {
        const nodes = [...inputNodes];
        let idx = nodes.length;
        while (--idx > -1) {
            const node = nodes[idx];
            nodes[idx] = null;
            let replace = true;
            let ancestor = node;
            while (ancestor) {
                if (nodes.indexOf(ancestor) > -1) {
                    replace = false;
                    nodes.splice(idx, 1);
                    break;
                }
                const parent = this.getNodeParent(ancestor);
                if (!parent)
                    break;
                ancestor = parent;
            }
            if (replace) {
                nodes[idx] = node;
            }
        }
        return nodes.filter((n) => n !== null);
    }
    existsOne(test, elems) {
        for (const node of elems) {
            if (this.isTag(node) && test(node)) {
                return true;
            }
        }
        return false;
    }
    getSiblings(node) {
        const parent = this.getNodeParent(node);
        return parent ? this.getChildren(parent) : [node];
    }
    getAttributeValue(elem, name) {
        return elem.getAttribute(name) ?? undefined;
    }
    hasAttrib(elem, name) {
        return elem.hasAttribute(name);
    }
    getName(elem) {
        return elem.tagName.toLocaleLowerCase();
    }
    findOne(test, elems) {
        for (const node of elems) {
            if (this.isTag(node)) {
                if (test(node))
                    return node;
                const children = this.getChildren(node);
                if (children.length > 0) {
                    const result = this.findOne(test, children);
                    if (result)
                        return result;
                }
            }
        }
        return null;
    }
    findAll(test, nodes) {
        let result = [];
        for (const node of nodes) {
            if (!this.isTag(node))
                continue;
            if (test(node))
                result.push(node);
            const children = this.getChildren(node);
            if (children.length) {
                result = result.concat(this.findAll(test, children));
            }
        }
        return result;
    }
    getText(node) {
        if (this.isTag(node)) {
            return this.getChildren(node).map(child => this.getText(child)).join('');
        }
        if (node.nodeType === NodeTypes_1.NodeTypes.TEXT_NODE) {
            return node.nodeValue ?? '';
        }
        return '';
    }
}
exports.CssSelectAdapter = CssSelectAdapter;
