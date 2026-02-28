"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedNodeMap = void 0;
class NamedNodeMapStore {
    itemsLookup = () => ({});
}
class NamedNodeMap {
    namedNodeMapStore = new NamedNodeMapStore();
    get length() {
        return Object.keys(this.namedNodeMapStore.itemsLookup()).length;
    }
    item(index) {
        const items = Object.values(this.namedNodeMapStore.itemsLookup());
        return items[index] ?? null;
    }
    setNamedItem(attr) {
        const items = this.namedNodeMapStore.itemsLookup();
        const oldAttr = items[attr.name] ?? null;
        const itemsFuture = this.namedNodeMapStore.itemsLookup;
        this.namedNodeMapStore.itemsLookup = () => Object.assign(itemsFuture(), { [attr.name]: attr });
        return oldAttr;
    }
    getNamedItem(name) {
        return this.namedNodeMapStore.itemsLookup()[name] ?? null;
    }
    removeNamedItem(name) {
        const currentItems = this.namedNodeMapStore.itemsLookup();
        const removed = currentItems[name] ?? null;
        const previousItems = this.namedNodeMapStore.itemsLookup;
        this.namedNodeMapStore.itemsLookup = () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [name]: _deleted_, ...result } = previousItems();
            return result;
        };
        return removed;
    }
    getNamedItemNS(namespaceURI, localName) {
        const items = Object.values(this.namedNodeMapStore.itemsLookup());
        for (const attr of items) {
            if (attr.namespaceURI === namespaceURI && attr.localName === localName) {
                return attr;
            }
        }
        return null;
    }
    setNamedItemNS(attr) {
        // NS-aware: key by namespace+localName
        const items = Object.values(this.namedNodeMapStore.itemsLookup());
        let oldAttr = null;
        for (const existing of items) {
            if (existing.namespaceURI === attr.namespaceURI && existing.localName === attr.localName) {
                oldAttr = existing;
                break;
            }
        }
        // Remove old attr by its name key if found
        if (oldAttr) {
            const previousItems = this.namedNodeMapStore.itemsLookup;
            this.namedNodeMapStore.itemsLookup = () => {
                const items = { ...previousItems() };
                delete items[oldAttr.name];
                items[attr.name] = attr;
                return items;
            };
        }
        else {
            const itemsFuture = this.namedNodeMapStore.itemsLookup;
            this.namedNodeMapStore.itemsLookup = () => Object.assign(itemsFuture(), { [attr.name]: attr });
        }
        return oldAttr;
    }
    removeNamedItemNS(namespaceURI, localName) {
        const items = Object.values(this.namedNodeMapStore.itemsLookup());
        let targetName = null;
        let removed = null;
        for (const attr of items) {
            if (attr.namespaceURI === namespaceURI && attr.localName === localName) {
                targetName = attr.name;
                removed = attr;
                break;
            }
        }
        if (targetName !== null) {
            const name = targetName;
            const previousItems = this.namedNodeMapStore.itemsLookup;
            this.namedNodeMapStore.itemsLookup = () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [name]: _deleted_, ...result } = previousItems();
                return result;
            };
        }
        return removed;
    }
    *[Symbol.iterator]() {
        const items = this.namedNodeMapStore.itemsLookup();
        for (const value of Object.values(items)) {
            yield value;
        }
    }
}
exports.NamedNodeMap = NamedNodeMap;
