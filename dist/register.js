"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lazyDom_1 = __importDefault(require("./lazyDom"));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.__LAZY_DOM__ = true;
(0, lazyDom_1.default)();
