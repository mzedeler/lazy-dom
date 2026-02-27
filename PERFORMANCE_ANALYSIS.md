# Performance Call-Chain Analysis: `getChildNodesArray()`

## The Critical Chain (shared by nearly all queries)

```
screen.queryBy*(...)
  → @testing-library/dom internals
    → Element.querySelector() / querySelectorAll() / matches()
      → css-select (CSSselect.selectAll/selectOne/is)
        → CssSelectAdapter.getChildren()     — calls node.childNodes.values()
        → CssSelectAdapter.findAll/findOne()  — recursively calls getChildren()
        → CssSelectAdapter.getText()          — recursively calls getChildren()
          → ChildNodeList.values()
            → nodeStore.getChildNodesArray()
```

## Which testing-library calls trigger it

| Call | How it reaches `getChildNodesArray()` |
|------|---------------------------------------|
| `screen.queryByText()` | querySelectorAll → findAll/getText → getChildren → `.values()` |
| `screen.queryByRole()` | querySelectorAll → findAll/getText → getChildren → `.values()` |
| `screen.queryByTestId()` | querySelector with attribute selector → same chain |
| `screen.queryByTitle()` | querySelector with attribute selector → same chain |
| `screen.queryByAltText()` | querySelector with attribute selector → same chain |
| `screen.queryByPlaceholderText()` | querySelector with attribute selector → same chain |
| `screen.queryByLabelText()` | querySelector → same chain |
| `screen.queryByDisplayValue()` | querySelector → same chain |
| `render()` (react) | React reconciler accesses `childNodes[i]` and `.length` during DOM mutations, which hit `getChildNode()` and `getChildNodesArray()` respectively |
| `screen.debug()` | getText → getChildren → `.values()` |

Every query traverses the DOM tree recursively via `CssSelectAdapter.getChildren()` (`src/utils/CssSelectAdapter.ts:13`), which calls `node.childNodes.values()`, which calls `getChildNodesArray()`. The recursive `findAll()`/`findOne()`/`getText()` methods repeat this for every node visited.

---

## COMPREHENSIVE TRACE: ALL CODE PATHS TO `getChildNodesArray()` ON A NodeStore

### 1. DIRECT CALL SITES OF `getChildNodesArray()`

**File: `/home/mike/workspace/lazy-dom/src/classes/Node/ChildNodeList.ts`**
- **Line 27**: `this.nodeStore.getChildNodesArray().length` (in `get length()`)
- **Line 35**: `this.nodeStore.getChildNodesArray().forEach(...)` (in `forEach()`)
- **Line 40**: `this.nodeStore.getChildNodesArray().map((_, i) => i)` (in `keys()`)
- **Line 44**: `this.nodeStore.getChildNodesArray().map<[number, Node]>(...)` (in `entries()`)
- **Line 48**: `this.nodeStore.getChildNodesArray()` (in `values()`)

**File: `/home/mike/workspace/lazy-dom/src/classes/Element.ts`**
- **Line 68**: `this.nodeStore.getChildNodesArray().map((node: Node)...)` (in `get outerHTML`)
- **Line 88**: `const children = this.nodeStore.getChildNodesArray()` (in `get textContent`)

**File: `/home/mike/workspace/lazy-dom/src/classes/Node/NodeStore.ts`**
- **Line 37**: `return this._childNodes()[index];` (in `getChildNode()`)
- **Line 41**: `return this._childNodes();` (in `getChildNodesArray()` itself - returns the thunk result)

### 2. DIRECT CALL SITES OF `getChildNode()`

**File: `/home/mike/workspace/lazy-dom/src/classes/Node/ChildNodeList.ts`**
- **Line 18**: `return target.nodeStore.getChildNode(index);` (in Proxy `get` trap for numeric indices)
- **Line 31**: `return this.nodeStore.getChildNode(index) ?? null;` (in `item()`)

### 3. PUBLIC API CALL CHAIN - FROM TESTING-LIBRARY APIs TO getChildNodesArray()

#### Path 1: Via `childNodes` Iterator Access

```
screen.queryByText()/queryByRole()/getByText()/getByRole()
    ↓
@testing-library/dom internal search
    ↓
Uses css-select library via querySelector/querySelectorAll/matches
    ↓
Element.querySelector() / Element.querySelectorAll() / Element.matches()
    [File: /home/mike/workspace/lazy-dom/src/classes/Element.ts, lines 188-197]
    ↓
CSSselect.selectOne() / CSSselect.selectAll() / CSSselect.is()
    [Uses CssSelectAdapter]
    ↓
CssSelectAdapter methods (File: /home/mike/workspace/lazy-dom/src/utils/CssSelectAdapter.ts):
    - getChildren() [line 13]: calls node.childNodes.values()
    - findAll() [line 108-123]: recursively calls getChildren()
    - findOne() [line 91-106]: recursively calls getChildren()
    - getText() [line 125-137]: calls getChildren()
    ↓
node.childNodes (getter in Node class)
    [File: /home/mike/workspace/lazy-dom/src/classes/Node/Node.ts, line 46-48]
    Returns: this._childNodes (a ChildNodeList instance)
    ↓
ChildNodeList.values() / [Symbol.iterator]()
    [File: /home/mike/workspace/lazy-dom/src/classes/Node/ChildNodeList.ts]
    - values() [line 47-49]: calls getChildNodesArray().map()
    - [Symbol.iterator]() [line 51-53]: calls nodeStore.childNodes()
    ↓
NodeStore.childNodes (getter)
    [File: /home/mike/workspace/lazy-dom/src/classes/Node/NodeStore.ts, line 31-34]
    Returns an iterator created from: toIterator(this._childNodes())
    ↓
TRIGGERS: getChildNodesArray() / getChildNode()
```

#### Path 2: Via Direct ChildNodeList Methods

```
user code: node.childNodes.forEach()/length/item()/entries()/keys()
    [ChildNodeList public methods]
    ↓
ChildNodeList.forEach() [line 34-36]
ChildNodeList.get length() [line 26-28]
ChildNodeList.item() [line 30-32]
ChildNodeList.entries() [line 43-45]
ChildNodeList.keys() [line 39-41]
    ↓
All call: nodeStore.getChildNodesArray() or nodeStore.getChildNode()
```

#### Path 3: Via Proxy Numeric Access

```
user code: node.childNodes[0] / node.childNodes[1] / etc
    [Proxy trap on ChildNodeList]
    ↓
ChildNodeList constructor Proxy get trap [line 13-22]
    ↓
target.nodeStore.getChildNode(index)
    ↓
Returns node at that index
```

#### Path 4: Via Element Properties

```
user code: element.outerHTML / element.textContent
    ↓
Element.get outerHTML() [line 62-81]
Element.get textContent() [line 87-97]
    [File: /home/mike/workspace/lazy-dom/src/classes/Element.ts]
    ↓
this.nodeStore.getChildNodesArray()
    ↓
Processes all child nodes for rendering/text extraction
```

#### Path 5: Via Document Subtree Traversal

```
Document operations like disconnect/connect
    [File: /home/mike/workspace/lazy-dom/src/classes/Document.ts, line 31-46]
    ↓
subtree() function which walks:
    nextNode.childNodes.forEach((childNode: Node) => stack.push(childNode))
    ↓
This accesses ChildNodeList.forEach()
    ↓
Which calls nodeStore.getChildNodesArray()
```

### 4. DETAILED CssSelectAdapter ANALYSIS

**File: `/home/mike/workspace/lazy-dom/src/utils/CssSelectAdapter.ts`**

The CssSelectAdapter is the critical bridge between css-select (used by querySelector/querySelectorAll) and child node traversal:

```typescript
// Line 13-22: getChildren() - PRIMARY ENTRY POINT
getChildren<NV>(node: Node<NV>): Node[] {
  const result: Node[] = []
  const iterator = node.childNodes.values()  // CALLS ChildNodeList.values()
  for (let { value, done } = iterator.next(); !done; { value, done } = iterator.next()) {
    result.push(value)
  }
  return result
}

// Line 71-74: getSiblings()
getSiblings(node: Node): Node[] {
  const parent = this.getParent(node)
  return parent ? this.getChildren(parent) : [node]  // CALLS getChildren()
}

// Line 91-106: findOne() - RECURSIVE
findOne(test: NodeTest, nodes: Node[]): Node | null | undefined {
  for(let i = 0, l = nodes.length; i < l && !node; i++){
    if(test(nodes[i])){
      node = nodes[i];
    } else {
      const childs = this.getChildren(nodes[i]);  // CALLS getChildren()
      if(childs && childs.length > 0){
        node = this.findOne(test, childs);  // RECURSIVE
      }
    }
  }
  return node;
}

// Line 108-123: findAll() - RECURSIVE
findAll(test: NodeTest, nodes: Node[]): Node[] {
  let result: Node[] = [];
  for(let i = 0, j = nodes.length; i < j; i++){
    if(test(nodes[i])) {
      result.push(nodes[i]);
    }
    const children = this.getChildren(nodes[i]);  // CALLS getChildren()
    if(children) {
      result = result.concat(this.findAll(test, children));  // RECURSIVE
    }
  }
  return result;
}

// Line 125-137: getText() - RECURSIVE
getText(input: Node[] | Node): string | undefined {
  if (Array.isArray(input)) {
    return input.map(this.getText).join('')
  }
  if (this.isTag(input)) {
    return this.getText(this.getChildren(input))  // CALLS getChildren()
  }
  if (input.nodeType === NodeTypes.TEXT_NODE) {
    return input.nodeValue!
  }
}
```

### 5. TESTING-LIBRARY CALL PATTERNS

**From `/home/mike/workspace/lazy-dom/test/testing-library-dom.test.ts`:**

Testing-library uses the following APIs that ultimately hit getChildNodesArray():

1. **`screen.queryByText(text)`** - Searches DOM for elements containing text
   - Internally uses querySelectorAll → CssSelectAdapter.findAll() → getChildren() → getChildNodesArray()

2. **`screen.getByText(regex)`** - Like queryByText but throws if not found
   - Same path as queryByText

3. **`screen.queryByTestId(id)`** - Searches for elements with data-testid attribute
   - Uses querySelector with attribute selector

4. **`screen.queryByRole(role)`** - Searches for elements with specific ARIA role
   - Uses querySelectorAll with attribute selectors
   - May iterate childNodes to check role compatibility

5. **`screen.queryByTitle(title)`** - Searches for title attribute
6. **`screen.queryByAltText(altText)`** - Searches for alt attribute
7. **`screen.queryByPlaceholderText(text)`** - Searches for placeholder attribute
8. **`screen.queryByLabelText(text)`** - Searches label relationships

**From `/home/mike/workspace/lazy-dom/test/testing-library-react.test.ts`:**

React testing library adds:
- **`render(element)`** - Renders React component into DOM
- **`cleanup()`** - Cleans up after tests
- **`screen.debug()`** - Outputs DOM for debugging (uses getText from CssSelectAdapter)

All of these eventually need to traverse the DOM tree, which requires accessing childNodes.

### 6. KEY ITERATOR/TRAVERSAL POINTS

**ChildNodeList Symbol.iterator (Line 51-53):**
```typescript
[Symbol.iterator]() {
  return this.nodeStore.childNodes()  // Returns iterator via NodeStore.childNodes getter
}
```

**NodeStore.childNodes getter (Line 31-34):**
```typescript
get childNodes(): Future<Iterator<Node<any>>> {
  const arrayThunk = this._childNodes;
  return () => toIterator(arrayThunk());  // Converts array to iterator
}
```

This is where the lazy evaluation happens - `_childNodes` is a thunk that gets called, which triggers getChildNodesArray().

### 7. SUMMARY OF ALL DIRECT CALLERS

| Method | Caller | File | Lines |
|--------|--------|------|-------|
| `getChildNodesArray()` | ChildNodeList.length getter | ChildNodeList.ts | 27 |
| `getChildNodesArray()` | ChildNodeList.forEach() | ChildNodeList.ts | 35 |
| `getChildNodesArray()` | ChildNodeList.keys() | ChildNodeList.ts | 40 |
| `getChildNodesArray()` | ChildNodeList.entries() | ChildNodeList.ts | 44 |
| `getChildNodesArray()` | ChildNodeList.values() | ChildNodeList.ts | 48 |
| `getChildNodesArray()` | Element.outerHTML | Element.ts | 68 |
| `getChildNodesArray()` | Element.textContent | Element.ts | 88 |
| `getChildNode()` | ChildNodeList Proxy trap | ChildNodeList.ts | 18 |
| `getChildNode()` | ChildNodeList.item() | ChildNodeList.ts | 31 |
| `getChildNodesArray()` | NodeStore.getChildNode() | NodeStore.ts | 37 |

### 8. COMPLETE CALL CHAIN SUMMARY

**The most critical path for testing-library queries:**

```
screen.queryByText/Role/etc
    ↓ (via @testing-library/dom)
Document.querySelectorAll() or Element.querySelector/All/matches()
    ↓
css-select library (CSSselect.selectAll/selectOne/is)
    ↓
CssSelectAdapter.getChildren()
    ↓
node.childNodes.values()
    ↓
ChildNodeList.values()
    ↓
nodeStore.getChildNodesArray()
    ↓
nodeStore._childNodes() [the thunk/memoized function]
    ↓
Returns: Node<any>[]
```

**Each array access in css-select's recursive findAll/findOne/getText triggers this chain for every node in the tree.**

### 9. KEY FILES

1. **`/home/mike/workspace/lazy-dom/src/classes/Node/NodeStore.ts`** - Definition of getChildNodesArray() and getChildNode()
2. **`/home/mike/workspace/lazy-dom/src/classes/Node/ChildNodeList.ts`** - 5 direct call sites of getChildNodesArray()
3. **`/home/mike/workspace/lazy-dom/src/classes/Element.ts`** - 2 direct call sites + contains querySelector/querySelectorAll definitions
4. **`/home/mike/workspace/lazy-dom/src/utils/CssSelectAdapter.ts`** - Critical bridge: getChildren() calls node.childNodes.values() which triggers the chain
5. **`/home/mike/workspace/lazy-dom/src/classes/Node/Node.ts`** - Defines the childNodes property and ChildNodeList creation
6. **`/home/mike/workspace/lazy-dom/test/testing-library-dom.test.ts`** - Uses screen.queryByText/Role which trigger the chain
7. **`/home/mike/workspace/lazy-dom/test/testing-library-react.test.ts`** - Uses render() and screen queries
