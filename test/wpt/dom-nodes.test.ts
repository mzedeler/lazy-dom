/**
 * WPT dom/nodes test entrypoint.
 *
 * Each `describe()` block loads a single WPT test file.
 * The shim maps WPT's test()/assert_*() API to Mocha/Chai.
 */
import { installWPTGlobals, resetWPTState, loadWPTHtml, loadWPTScript } from './testharness-shim'
import { setFileContext } from './expectations'

// ---------------------------------------------------------------------------
// DOM setup helpers — some WPT HTML files expect pre-existing DOM elements
// ---------------------------------------------------------------------------

function clearBody(): void {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }
}

/**
 * Set up DOM for Element-hasAttributes.html:
 * <button></button>
 * <div id="foo"></div>
 * <p data-foo=""></p>
 */
function setupHasAttributes(): void {
  clearBody()
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  const div = document.createElement('div')
  div.setAttribute('id', 'foo')
  document.body.appendChild(div)
  const p = document.createElement('p')
  p.setAttribute('data-foo', '')
  document.body.appendChild(p)
}

/**
 * Set up DOM for Element-firstElementChild.html:
 * <p id="parentEl">text<span id="first_element_child">logged above.</span></p>
 */
function setupFirstElementChild(): void {
  clearBody()
  const p = document.createElement('p')
  p.setAttribute('id', 'parentEl')
  p.appendChild(document.createTextNode('The result of this test is\n'))
  const span = document.createElement('span')
  span.setAttribute('id', 'first_element_child')
  span.setAttribute('style', 'font-weight:bold;')
  span.appendChild(document.createTextNode('logged above.'))
  p.appendChild(span)
  document.body.appendChild(p)
}

/**
 * Set up DOM for Element-lastElementChild.html:
 * <p id="parentEl">The result of <span id="first_element_child">this test</span>
 *   is <span id="last_element_child">logged</span> above.</p>
 */
function setupLastElementChild(): void {
  clearBody()
  const p = document.createElement('p')
  p.setAttribute('id', 'parentEl')
  p.appendChild(document.createTextNode('The result of '))
  const span1 = document.createElement('span')
  span1.setAttribute('id', 'first_element_child')
  span1.appendChild(document.createTextNode('this test'))
  p.appendChild(span1)
  p.appendChild(document.createTextNode(' is '))
  const span2 = document.createElement('span')
  span2.setAttribute('id', 'last_element_child')
  span2.setAttribute('style', 'font-weight:bold;')
  span2.appendChild(document.createTextNode('logged'))
  p.appendChild(span2)
  p.appendChild(document.createTextNode(' above.'))
  document.body.appendChild(p)
}

/**
 * Set up DOM for Element-childElementCount.html:
 * <p id="parentEl">text<span id="first_element_child"><span>this</span> <span>test</span></span> is
 *   <span id="middle_element_child">given above.</span>\n\n\n
 *   <span id="last_element_child">fnord</span> </p>
 */
function setupChildElementCount(): void {
  clearBody()
  const p = document.createElement('p')
  p.setAttribute('id', 'parentEl')
  p.appendChild(document.createTextNode('The result of '))

  const span1 = document.createElement('span')
  span1.setAttribute('id', 'first_element_child')
  const inner1 = document.createElement('span')
  inner1.appendChild(document.createTextNode('this'))
  span1.appendChild(inner1)
  span1.appendChild(document.createTextNode(' '))
  const inner2 = document.createElement('span')
  inner2.appendChild(document.createTextNode('test'))
  span1.appendChild(inner2)
  p.appendChild(span1)

  p.appendChild(document.createTextNode(' is\n'))

  const span2 = document.createElement('span')
  span2.setAttribute('id', 'middle_element_child')
  span2.setAttribute('style', 'font-weight:bold;')
  span2.appendChild(document.createTextNode('given above.'))
  p.appendChild(span2)

  p.appendChild(document.createTextNode('\n\n\n'))

  const span3 = document.createElement('span')
  span3.setAttribute('id', 'last_element_child')
  span3.setAttribute('style', 'display:none;')
  span3.appendChild(document.createTextNode('fnord'))
  p.appendChild(span3)

  p.appendChild(document.createTextNode(' '))
  document.body.appendChild(p)
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

// Install globals immediately — WPT test files call test() at eval-time
// (during describe), not inside before() hooks.
installWPTGlobals()

describe('WPT: dom/nodes', function () {
  this.timeout(10000)

  // --- CharacterData tests (self-contained, no DOM prereqs) ---

  describe('CharacterData-appendData', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-appendData')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-appendData.html')
  })

  describe('CharacterData-data', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-data')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-data.html')
  })

  describe('CharacterData-deleteData', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-deleteData')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-deleteData.html')
  })

  describe('CharacterData-insertData', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-insertData')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-insertData.html')
  })

  describe('CharacterData-replaceData', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-replaceData')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-replaceData.html')
  })

  describe('CharacterData-substringData', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-substringData')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-substringData.html')
  })

  describe('CharacterData-remove', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('CharacterData-remove')
    loadWPTHtml('vendor/wpt/dom/nodes/CharacterData-remove.html')
  })

  // --- Node tests ---

  describe('Node-nodeName', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-nodeName')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-nodeName.html')
  })

  describe('Node-nodeValue', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-nodeValue')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-nodeValue.html')
  })

  describe('Node-textContent', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-textContent')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-textContent.html')
  })

  describe('Node-constants', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-constants')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-constants.html')
  })

  describe('Node-parentNode', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-parentNode')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-parentNode.html')
  })

  describe('Node-parentElement', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-parentElement')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-parentElement.html')
  })

  describe('Node-normalize', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Node-normalize')
    loadWPTHtml('vendor/wpt/dom/nodes/Node-normalize.html')
  })

  // --- Document tests ---

  describe('Document-createComment-createTextNode', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('Document-createComment-createTextNode')
    loadWPTScript('vendor/wpt/dom/nodes/Document-createComment-createTextNode.js')
  })

  describe('DocumentFragment-constructor', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('DocumentFragment-constructor')
    loadWPTHtml('vendor/wpt/dom/nodes/DocumentFragment-constructor.html')
  })

  describe('DOMImplementation-hasFeature', () => {
    before(() => { clearBody(); resetWPTState() })
    setFileContext('DOMImplementation-hasFeature')
    loadWPTHtml('vendor/wpt/dom/nodes/DOMImplementation-hasFeature.html')
  })

  // --- Element tests (need DOM setup) ---

  describe('Element-hasAttributes', () => {
    before(() => { setupHasAttributes(); resetWPTState() })
    setFileContext('Element-hasAttributes')
    loadWPTHtml('vendor/wpt/dom/nodes/Element-hasAttributes.html')
  })

  describe('Element-firstElementChild', () => {
    before(() => { setupFirstElementChild(); resetWPTState() })
    setFileContext('Element-firstElementChild')
    loadWPTHtml('vendor/wpt/dom/nodes/Element-firstElementChild.html')
  })

  describe('Element-lastElementChild', () => {
    before(() => { setupLastElementChild(); resetWPTState() })
    setFileContext('Element-lastElementChild')
    loadWPTHtml('vendor/wpt/dom/nodes/Element-lastElementChild.html')
  })

  describe('Element-childElementCount', () => {
    before(() => { setupChildElementCount(); resetWPTState() })
    setFileContext('Element-childElementCount')
    loadWPTHtml('vendor/wpt/dom/nodes/Element-childElementCount.html')
  })
})
