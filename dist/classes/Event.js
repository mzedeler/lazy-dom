"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var valueNotSetError_1 = require("../utils/valueNotSetError");
var EventStore = /** @class */ (function () {
    function EventStore() {
        this.type = function () {
            throw (0, valueNotSetError_1.default)('type');
        };
        this.target = function () {
            throw (0, valueNotSetError_1.default)('target');
        };
    }
    return EventStore;
}());
var Event = /** @class */ (function () {
    function Event() {
        this.eventStore = new EventStore();
    }
    Object.defineProperty(Event.prototype, "target", {
        get: function () {
            return this.eventStore.target();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "type", {
        get: function () {
            return this.eventStore.type();
        },
        enumerable: false,
        configurable: true
    });
    return Event;
}());
exports.Event = Event;
