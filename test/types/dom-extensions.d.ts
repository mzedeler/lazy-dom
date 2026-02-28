// Type augmentations for DOM properties used in tests but not on the
// TypeScript types that document/element accessors return.

declare global {
  // document.body is typed as HTMLElement, but body-specific deprecated
  // properties (aLink, bgColor, etc.) are only on HTMLBodyElement.
  // Since tests always access document.body which IS a <body> element,
  // we augment HTMLElement with these properties.
  interface HTMLElement {
    aLink: string
    background: string
    bgColor: string
    link: string
    text: string
    vLink: string
  }

  // document.attributes and pi.attributes are not on Document or
  // ProcessingInstruction in the standard types, but both JSDOM and
  // lazy-dom expose them (as null/undefined).
  interface Document {
    readonly attributes: null | undefined
  }

  interface ProcessingInstruction {
    readonly attributes: null
  }

  // lowSrc (camelCase) is supported by both JSDOM and lazy-dom but
  // the standard types only have lowercase `lowsrc`.
  interface HTMLImageElement {
    lowSrc: string
  }
}

export {}
