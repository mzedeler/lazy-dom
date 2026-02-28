"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const valueNotSetError_1 = __importDefault(require("../utils/valueNotSetError"));
class EventStore {
    type = () => {
        throw (0, valueNotSetError_1.default)('type');
    };
    target = () => {
        throw (0, valueNotSetError_1.default)('target');
    };
}
class Event {
    eventStore = new EventStore();
    defaultPrevented = false;
    cancelBubble = false;
    bubbles = false;
    cancelable = false;
    get target() {
        return this.eventStore.target();
    }
    get type() {
        return this.eventStore.type();
    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    stopPropagation() {
        this.cancelBubble = true;
    }
    stopImmediatePropagation() {
        this.cancelBubble = true;
    }
}
exports.Event = Event;
