"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointerEvent = void 0;
const Event_1 = require("./Event");
class UIEvent extends Event_1.Event {
}
class MouseEvent extends UIEvent {
}
class PointerEvent extends MouseEvent {
}
exports.PointerEvent = PointerEvent;
