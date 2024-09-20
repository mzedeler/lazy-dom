"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedNodeMap = void 0;
var NamedNodeMapStore = /** @class */ (function () {
    function NamedNodeMapStore() {
        this.itemsLookup = function () { return ({}); };
    }
    return NamedNodeMapStore;
}());
var NamedNodeMap = /** @class */ (function () {
    function NamedNodeMap() {
        this.namedNodeMapStore = new NamedNodeMapStore();
    }
    Object.defineProperty(NamedNodeMap.prototype, "length", {
        get: function () {
            return Object.keys(this.namedNodeMapStore.itemsLookup()).length;
        },
        enumerable: false,
        configurable: true
    });
    NamedNodeMap.prototype.setNamedItem = function (attr) {
        var itemsFuture = this.namedNodeMapStore.itemsLookup;
        this.namedNodeMapStore.itemsLookup = function () {
            var _a;
            return Object.assign(itemsFuture(), (_a = {}, _a[attr.name] = attr, _a));
        };
    };
    NamedNodeMap.prototype.getNamedItem = function (name) {
        return this.namedNodeMapStore.itemsLookup()[name];
    };
    NamedNodeMap.prototype.removeNamedItem = function (name) {
        var previousItems = this.namedNodeMapStore.itemsLookup;
        this.namedNodeMapStore.itemsLookup = function () {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            var _a = previousItems(), _b = name, _deleted_ = _a[_b], result = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
            return result;
        };
    };
    NamedNodeMap.prototype[Symbol.iterator] = function () {
        var items, _i, _a, value;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    items = this.namedNodeMapStore.itemsLookup();
                    _i = 0, _a = Object.values(items);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    value = _a[_i];
                    return [4 /*yield*/, value];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return NamedNodeMap;
}());
exports.NamedNodeMap = NamedNodeMap;
