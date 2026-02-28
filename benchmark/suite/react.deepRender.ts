import { createRoot } from 'react-dom/client'
import * as React from 'react'

// @ts-expect-error TODO
globalThis.IS_REACT_ACT_ENVIRONMENT = true

/**
 * Benchmarks for React render with nested providers.
 * Simulates the renderWithProviders() pattern (5-6 nested context providers).
 * Provider components are defined at module scope (not inside benchmark fn).
 */

// Simple provider components — each wraps children in a div with attributes
const Provider1 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'theme', className: 'theme-provider' }, children)

const Provider2 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'auth', className: 'auth-provider' }, children)

const Provider3 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'router', className: 'router-provider' }, children)

const Provider4 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'store', className: 'store-provider' }, children)

const Provider5 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'i18n', className: 'i18n-provider' }, children)

const Provider6 = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-provider': 'query', className: 'query-provider' }, children)

const LeafComponent = ({ label }: { label: string }) =>
  React.createElement('div', { className: 'leaf', 'data-testid': 'leaf' },
    React.createElement('h2', null, label),
    React.createElement('p', null, 'Some content here'),
    React.createElement('button', { type: 'button' }, 'Click me')
  )

function renderWithProviders(leaf: React.ReactElement) {
  return React.createElement(Provider1, null,
    React.createElement(Provider2, null,
      React.createElement(Provider3, null,
        React.createElement(Provider4, null,
          React.createElement(Provider5, null,
            React.createElement(Provider6, null, leaf)
          )
        )
      )
    )
  )
}

export const reactDeepRender = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  React.act(() => root.render(renderWithProviders(
    React.createElement(LeafComponent, { label: 'Hello' })
  )))
  document.body.removeChild(div)
}

export const reactDeepRenderWithSnapshot = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  React.act(() => root.render(renderWithProviders(
    React.createElement(LeafComponent, { label: 'Hello' })
  )))
  // Simulate snapshot testing — force full serialization
  const _html = div.outerHTML
  document.body.removeChild(div)
  return _html
}

export const reactDeepRenderRerender = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  const root = createRoot(div)
  React.act(() => root.render(renderWithProviders(
    React.createElement(LeafComponent, { label: 'Hello' })
  )))
  // Re-render with changed props
  React.act(() => root.render(renderWithProviders(
    React.createElement(LeafComponent, { label: 'Updated' })
  )))
  document.body.removeChild(div)
}
