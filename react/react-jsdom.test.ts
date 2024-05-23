import { JSDOM } from 'jsdom'

import { suite } from './suite'

describe('react with JSDOM', () => {
  beforeEach(() => {
    const dom = new JSDOM(``, {
      url: "https://example.org/",
      referrer: "https://example.com/",
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000
    })

    // @ts-expect-error
    global.window = dom.window
    global.document = dom.window.document
  })

  suite()
})
