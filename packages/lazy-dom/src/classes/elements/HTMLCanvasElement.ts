import { HTMLElement } from "./HTMLElement"

const noop = () => { /* no-op */ }

/** Minimal CanvasRenderingContext2D stub for libraries that feature-detect canvas. */
function createContext2dStub(): Record<string, unknown> {
  return {
    canvas: null,
    fillStyle: '',
    strokeStyle: '',
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    lineDashOffset: 0,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    // Drawing methods
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    arcTo: noop,
    ellipse: noop,
    rect: noop,
    fill: noop,
    stroke: noop,
    clip: noop,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    fillText: noop,
    strokeText: noop,
    measureText: () => ({ width: 0 }),
    // Transform methods
    save: noop,
    restore: noop,
    scale: noop,
    rotate: noop,
    translate: noop,
    transform: noop,
    setTransform: noop,
    resetTransform: noop,
    // Image methods
    drawImage: noop,
    createImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
    getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
    putImageData: noop,
    // Gradient/pattern
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    createPattern: () => ({}),
    // Path
    isPointInPath: () => false,
    isPointInStroke: () => false,
    getLineDash: () => [],
    setLineDash: noop,
    createConicGradient: () => ({ addColorStop: noop }),
  }
}

export class HTMLCanvasElement extends HTMLElement {
  width = 300
  height = 150

  getContext(contextId: string): Record<string, unknown> | null {
    if (contextId === '2d') {
      const ctx = createContext2dStub()
      ctx.canvas = this
      return ctx
    }
    return null
  }

  toDataURL(_type?: string, _quality?: number): string {
    return 'data:,'
  }

  toBlob(_callback: (blob: Blob | null) => void, _type?: string, _quality?: number): void {
    // no-op in test environment
  }
}
