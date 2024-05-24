import { Future } from "../types/Future"
import { NodeTypes } from "../types/NodeTypes"
import valueNotSetError from "../utils/valueNotSetError"

import { Document } from "./Document"

class NodeStore {
  nodeType: Future<NodeTypes> = () => {
    throw valueNotSetError('nodeType')
  }
  ownerDocument: Future<Document> = () => {
    throw valueNotSetError('ownerDocument')
  }
  parent: Future<Node | undefined> = () => undefined
}

export class Node {
  nodeStore = new NodeStore()

  get nodeType(): NodeTypes {
    return this.nodeStore.nodeType()
  }

  get ownerDocument(): Document {
    return this.nodeStore.ownerDocument()
  }

  get parent(): Node | undefined {
    return this.nodeStore.parent()
  }

  get parentNode(): Node | undefined {
    return this.nodeStore.parent()
  }
}
