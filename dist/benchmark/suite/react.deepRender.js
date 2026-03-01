"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactDeepRenderRerender = exports.reactDeepRenderWithSnapshot = exports.reactDeepRender = void 0;
const client_1 = require("react-dom/client");
const React = __importStar(require("react"));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
/**
 * Benchmarks for React render with nested providers.
 * Simulates the renderWithProviders() pattern (5-6 nested context providers).
 * Provider components are defined at module scope (not inside benchmark fn).
 */
// Simple provider components — each wraps children in a div with attributes
const Provider1 = ({ children }) => React.createElement('div', { 'data-provider': 'theme', className: 'theme-provider' }, children);
const Provider2 = ({ children }) => React.createElement('div', { 'data-provider': 'auth', className: 'auth-provider' }, children);
const Provider3 = ({ children }) => React.createElement('div', { 'data-provider': 'router', className: 'router-provider' }, children);
const Provider4 = ({ children }) => React.createElement('div', { 'data-provider': 'store', className: 'store-provider' }, children);
const Provider5 = ({ children }) => React.createElement('div', { 'data-provider': 'i18n', className: 'i18n-provider' }, children);
const Provider6 = ({ children }) => React.createElement('div', { 'data-provider': 'query', className: 'query-provider' }, children);
const LeafComponent = ({ label }) => React.createElement('div', { className: 'leaf', 'data-testid': 'leaf' }, React.createElement('h2', null, label), React.createElement('p', null, 'Some content here'), React.createElement('button', { type: 'button' }, 'Click me'));
function renderWithProviders(leaf) {
    return React.createElement(Provider1, null, React.createElement(Provider2, null, React.createElement(Provider3, null, React.createElement(Provider4, null, React.createElement(Provider5, null, React.createElement(Provider6, null, leaf))))));
}
const reactDeepRender = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = (0, client_1.createRoot)(div);
    React.act(() => root.render(renderWithProviders(React.createElement(LeafComponent, { label: 'Hello' }))));
    document.body.removeChild(div);
};
exports.reactDeepRender = reactDeepRender;
const reactDeepRenderWithSnapshot = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = (0, client_1.createRoot)(div);
    React.act(() => root.render(renderWithProviders(React.createElement(LeafComponent, { label: 'Hello' }))));
    // Simulate snapshot testing — force full serialization
    const _html = div.outerHTML;
    document.body.removeChild(div);
    return _html;
};
exports.reactDeepRenderWithSnapshot = reactDeepRenderWithSnapshot;
const reactDeepRenderRerender = () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = (0, client_1.createRoot)(div);
    React.act(() => root.render(renderWithProviders(React.createElement(LeafComponent, { label: 'Hello' }))));
    // Re-render with changed props
    React.act(() => root.render(renderWithProviders(React.createElement(LeafComponent, { label: 'Updated' }))));
    document.body.removeChild(div);
};
exports.reactDeepRenderRerender = reactDeepRenderRerender;
