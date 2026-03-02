import { parseDOM } from 'htmlparser2'
import type { Document } from '../classes/Document'
import type { Node } from '../classes/Node/Node'
import type { Element } from '../classes/Element'

interface ParsedNode {
  type: string
  name?: string
  data?: string
  attribs?: Record<string, string>
  children?: ParsedNode[]
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML'
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'
const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
const XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'

// SVG tag names that need case correction (htmlparser2 lowercases everything)
const svgTagNameMap: Record<string, string> = {
  altglyph: 'altGlyph',
  altglyphdef: 'altGlyphDef',
  altglyphitem: 'altGlyphItem',
  animatecolor: 'animateColor',
  animatemotion: 'animateMotion',
  animatetransform: 'animateTransform',
  clippath: 'clipPath',
  feblend: 'feBlend',
  fecolormatrix: 'feColorMatrix',
  fecomponenttransfer: 'feComponentTransfer',
  fecomposite: 'feComposite',
  feconvolvematrix: 'feConvolveMatrix',
  fediffuselighting: 'feDiffuseLighting',
  fedisplacementmap: 'feDisplacementMap',
  fedistantlight: 'feDistantLight',
  fedropshadow: 'feDropShadow',
  feflood: 'feFlood',
  fefunca: 'feFuncA',
  fefuncb: 'feFuncB',
  fefuncg: 'feFuncG',
  fefuncr: 'feFuncR',
  fegaussianblur: 'feGaussianBlur',
  feimage: 'feImage',
  femerge: 'feMerge',
  femergenode: 'feMergeNode',
  femorphology: 'feMorphology',
  feoffset: 'feOffset',
  fepointlight: 'fePointLight',
  fespecularlighting: 'feSpecularLighting',
  fespotlight: 'feSpotLight',
  fetile: 'feTile',
  feturbulence: 'feTurbulence',
  foreignobject: 'foreignObject',
  glyphref: 'glyphRef',
  lineargradient: 'linearGradient',
  radialgradient: 'radialGradient',
  textpath: 'textPath',
}

// SVG attribute names that need case correction
const svgAttrNameMap: Record<string, string> = {
  attributename: 'attributeName',
  attributetype: 'attributeType',
  basefrequency: 'baseFrequency',
  baseprofile: 'baseProfile',
  calcmode: 'calcMode',
  clippathunits: 'clipPathUnits',
  diffuseconstant: 'diffuseConstant',
  edgemode: 'edgeMode',
  filterunits: 'filterUnits',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  limitingconeangle: 'limitingConeAngle',
  markerheight: 'markerHeight',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  numoctaves: 'numOctaves',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  refx: 'refX',
  refy: 'refY',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stitchtiles: 'stitchTiles',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textlength: 'textLength',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  xchannelselector: 'xChannelSelector',
  ychannelselector: 'yChannelSelector',
  zoomandpan: 'zoomAndPan',
}

// Namespace prefixed attributes
const namespacedAttrMap: Record<string, [string, string]> = {
  'xlink:actuate': [XLINK_NAMESPACE, 'actuate'],
  'xlink:arcrole': [XLINK_NAMESPACE, 'arcrole'],
  'xlink:href': [XLINK_NAMESPACE, 'href'],
  'xlink:role': [XLINK_NAMESPACE, 'role'],
  'xlink:show': [XLINK_NAMESPACE, 'show'],
  'xlink:title': [XLINK_NAMESPACE, 'title'],
  'xlink:type': [XLINK_NAMESPACE, 'type'],
  'xml:base': [XML_NAMESPACE, 'base'],
  'xml:lang': [XML_NAMESPACE, 'lang'],
  'xml:space': [XML_NAMESPACE, 'space'],
  'xmlns:xlink': [XMLNS_NAMESPACE, 'xlink'],
}

// Elements whose first newline should be stripped when parsing innerHTML
const newlineEatingTags = new Set(['pre', 'listing', 'textarea'])

// Serialize parsed nodes back to raw HTML string (for <noscript> content)
function serializeParsedNodes(nodes: ParsedNode[]): string {
  return nodes.map(serializeParsedNode).join('')
}

function serializeParsedNode(node: ParsedNode): string {
  switch (node.type) {
    case 'tag':
    case 'script':
    case 'style': {
      const name = node.name!
      const attrs = node.attribs
        ? Object.entries(node.attribs).map(([k, v]) => ` ${k}="${v}"`).join('')
        : ''
      const children = node.children ? serializeParsedNodes(node.children) : ''
      return `<${name}${attrs}>${children}</${name}>`
    }
    case 'text':
      return node.data ?? ''
    case 'comment':
      return `<!--${node.data ?? ''}-->`
    default:
      return ''
  }
}

// Normalize text per HTML spec: \r\n → \n, lone \r → \n, \0 → \uFFFD
function normalizeText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\0/g, '\uFFFD')
}

export function parseHTML(html: string, ownerDocument: Document): Node[] {
  const parsed = parseDOM(html) as ParsedNode[]
  return convertNodes(parsed, ownerDocument, null)
}

function convertNodes(nodes: ParsedNode[], doc: Document, namespace: string | null): Node[] {
  const result: Node[] = []
  for (const node of nodes) {
    const converted = convertNode(node, doc, namespace)
    if (converted) {
      result.push(converted)
    }
  }
  return result
}

function setAttributes(element: Element, attribs: Record<string, string>, isSVG: boolean) {
  for (const [attrName, rawValue] of Object.entries(attribs)) {
    // Normalize attribute values per HTML spec
    const value = normalizeText(rawValue)

    // Handle namespaced attributes
    const nsEntry = namespacedAttrMap[attrName]
    if (nsEntry) {
      element.setAttributeNS(nsEntry[0], attrName, value)
      continue
    }

    // Fix SVG attribute case
    const fixedName = isSVG ? (svgAttrNameMap[attrName] ?? attrName) : attrName
    element.setAttribute(fixedName, value)
  }
}

function convertNode(node: ParsedNode, doc: Document, namespace: string | null): Node | null {
  switch (node.type) {
    case 'tag':
    case 'script':
    case 'style': {
      let name = node.name!

      // Determine the namespace for this element
      let childNamespace = namespace
      if (name === 'svg') {
        childNamespace = SVG_NAMESPACE
      } else if (name === 'math') {
        childNamespace = MATHML_NAMESPACE
      }

      const isSVG = childNamespace === SVG_NAMESPACE

      // Fix SVG tag name case
      if (isSVG) {
        name = svgTagNameMap[name] ?? name
      }

      const element = childNamespace
        ? doc.createElementNS(childNamespace, name)
        : doc.createElement(name)

      if (node.attribs) {
        setAttributes(element, node.attribs, isSVG)
      }

      // For <noscript> in a scripting context, store children as raw HTML text
      if (name === 'noscript' && node.children && node.children.length > 0) {
        const rawHTML = serializeParsedNodes(node.children)
        if (rawHTML) {
          element.appendChild(doc.createTextNode(rawHTML))
        }
        return element
      }

      if (node.children) {
        let children = convertNodes(node.children, doc, childNamespace)

        // Strip leading newline for newline-eating tags
        if (newlineEatingTags.has(name) && children.length > 0) {
          const first = children[0]
          if ('data' in first && typeof first.data === 'string' && first.data.startsWith('\n')) {
            first.data = first.data.substring(1)
            if (first.data === '') {
              children = children.slice(1)
            }
          }
        }

        for (const child of children) {
          element.appendChild(child)
        }
      }
      return element
    }
    case 'text':
      return doc.createTextNode(normalizeText(node.data ?? ''))
    case 'comment':
      return doc.createComment(node.data ?? '')
    default:
      return null
  }
}
