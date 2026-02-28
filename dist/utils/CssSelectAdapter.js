"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssSelectAdapter = void 0;
const NodeTypes_1 = require("../types/NodeTypes");
class CssSelectAdapter {
    isTag(node) {
        return node.nodeType === NodeTypes_1.NodeTypes.ELEMENT_NODE;
    }
    getChildren(node) {
        return Array.from(node.childNodes);
    }
    getParent(element) {
        return element.parentNode;
    }
    // Hackish version based on css-select-browser-adapter
    removeSubsets(inputNodes) {
        const nodes = [...inputNodes];
        let idx = nodes.length, node, ancestor, replace;
        // Check if each node (or one of its ancestors) is already contained in the
        // array.
        while (--idx > -1) {
            node = ancestor = nodes[idx];
            // Temporarily remove the node under consideration
            nodes[idx] = null;
            replace = true;
            while (ancestor) {
                if (nodes.indexOf(ancestor) > -1) {
                    replace = false;
                    nodes.splice(idx, 1);
                    break;
                }
                ancestor = this.getParent(ancestor);
            }
            // If the node has been found to be unique, re-insert it.
            if (replace) {
                nodes[idx] = node;
            }
        }
        return nodes;
    }
    existsOne(test, nodes) {
        const iterator = nodes.values();
        for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
            if (value && test(value)) {
                return true;
            }
        }
        return false;
    }
    getSiblings(node) {
        const parent = this.getParent(node);
        return parent ? this.getChildren(parent) : [node];
    }
    getAttributeValue(element, attributeName) {
        const attribute = element.attributes.getNamedItem(attributeName);
        if (attribute) {
            return typeof attribute === "string" ? attribute : attribute.value;
        }
    }
    hasAttrib(element, attributeName) {
        return element.attributes.getNamedItem(attributeName) !== null;
    }
    getName(element) {
        return element.tagName?.toLocaleLowerCase() ?? '';
    }
    findOne(test, nodes) {
        let node = null;
        for (let i = 0, l = nodes.length; i < l && !node; i++) {
            if (test(nodes[i])) {
                node = nodes[i];
            }
            else {
                const childs = this.getChildren(nodes[i]);
                if (childs && childs.length > 0) {
                    node = this.findOne(test, childs);
                }
            }
        }
        return node;
    }
    findAll(test, nodes) {
        let result = [];
        for (let i = 0, j = nodes.length; i < j; i++) {
            if (!this.isTag(nodes[i])) {
                continue;
            }
            if (test(nodes[i])) {
                result.push(nodes[i]);
            }
            const children = this.getChildren(nodes[i]);
            if (children) {
                result = result.concat(this.findAll(test, children));
            }
        }
        return result;
    }
    getText(input) {
        if (Array.isArray(input)) {
            return input.map(this.getText).join('');
        }
        if (this.isTag(input)) {
            return this.getText(this.getChildren(input));
        }
        if (input.nodeType === NodeTypes_1.NodeTypes.TEXT_NODE) {
            return input.nodeValue; // we just checked above
        }
    }
}
exports.CssSelectAdapter = CssSelectAdapter;
