import { Element } from "../classes/Element";
import { Node } from "../classes/Node";
import { NodeTypes } from "../types/NodeTypes";

type NodeTest = (node: Node) => boolean

export class CssSelectAdapter {
  isTag(node: Node): node is Element {
    return node.nodeType === NodeTypes.ELEMENT_NODE
  }

  getChildren(node: Node): Node[] {
    return node.childNodes
  }

  getParent(element: Node): Node | undefined {
    return element.parentNode
  }

  // Hackish version based on css-select-browser-adapter
  removeSubsets(inputNodes: Node[]): Node[] {
    const nodes: Array<Node | null> = [...inputNodes]
    let idx = nodes.length, node, ancestor, replace;
  
    // Check if each node (or one of its ancestors) is already contained in the
    // array.
    while(--idx > -1) {
      node = ancestor = nodes[idx];
  
      // Temporarily remove the node under consideration
      nodes[idx] = null;
      replace = true;
  
      while(ancestor) {
        if(nodes.indexOf(ancestor) > -1) {
          replace = false;
          nodes.splice(idx, 1);
          break;
        }
        ancestor = this.getParent(ancestor)
      }
  
      // If the node has been found to be unique, re-insert it.
      if(replace) {
        nodes[idx] = node;
      }
    }

    return nodes as Node[];
  }

  existsOne(test: NodeTest, nodes: Node[]): boolean {
		return nodes.some((node: Node) =>
      this.isTag(node)
        ? test(node) || this.existsOne(test, this.getChildren(node))
        : false
    )
  }

  getSiblings(node: Node): Node[] {
    const parent = this.getParent(node)
    return parent ? this.getChildren(parent) : [node]
  }

  getAttributeValue(element: Element, attributeName: string): string | undefined {
    const attribute = element.attributes.getNamedItem(attributeName)
    if (attribute) {
			return typeof attribute === "string" ? attribute : attribute.value;
		}
	}

  hasAttrib(element: Element, attributeName: string): boolean {
    return typeof element.attributes.getNamedItem(attributeName) !== 'undefined'
  }

  getName(element: Element): string {
    return element.tagName.toLocaleLowerCase()
  }

  findOne(test: NodeTest, nodes: Node[]): Node | null | undefined {
		let node = null;

		for(let i = 0, l = nodes.length; i < l && !node; i++){
			if(test(nodes[i])){
				node = nodes[i];
			} else {
				const childs = this.getChildren(nodes[i]);
				if(childs && childs.length > 0){
					node = this.findOne(test, childs);
				}
			}
		}

		return node;
  }

  findAll(test: NodeTest, nodes: Node[]): Node[] {
		let result: Node[] = [];
		for(let i = 0, j = nodes.length; i < j; i++){
			if(!this.isTag(nodes[i])) {
        continue;
      }
			if(test(nodes[i])) {
        result.push(nodes[i]);
      }
			const children = this.getChildren(nodes[i]);
			if(children) {
        result = result.concat(this.findAll(test, children));
      }
		}
		return result;
  }

  getText(input: Node[] | Node): string | undefined {
    if (Array.isArray(input)) {
      return input.map(this.getText).join('')
    }

    if (this.isTag(input)) {
      return this.getText(this.getChildren(input))
    }

    if (input.nodeType === NodeTypes.TEXT_NODE) {
      return input.nodeValue! // we just checked above
    }
  }
}
