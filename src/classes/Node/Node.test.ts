import { expect } from 'chai'
import { div } from '../../utils/div'

describe('Node', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('tre query and manipulation', () => {
    it('has removeChild()', () => {
      const rootId = 'root'
      const parent1Id = 'parent1'
      const parent2Id = 'parent2'
      const parent1Leaf1Id = 'leaf11'
      const parent1Leaf2Id = 'leaf12'
      const parent2Leaf = 'leaf2'
      const root =
        div(rootId,
          div(parent1Id,
            div(parent1Leaf1Id),
            div(parent1Leaf2Id)
          ),
          div(parent2Id,
            div(parent2Leaf)
          )
        )

        document.body.appendChild(root)
      const parent1 = document.getElementById(parent1Id)
      if (!parent1) {
        throw new Error('assertion failed: this element should exist')
      }
  
      root.removeChild(parent1)
  
      expect(root.outerHTML).to.eql('<div id="root"><div id="parent2"><div id="leaf2"></div></div></div>')
      expect(document.getElementById(parent1Id)).to.be.null
      expect(document.getElementById(parent1Leaf1Id)).to.be.null
      expect(document.getElementById(parent1Leaf2Id)).to.be.null
    })

    describe('childNodes', () => {
      it('has childNodes', () => {
        const root = div('root')
        expect(root.childNodes).not.to.be.undefined
      })    

      it('supports Array.from() with childNodes to convert to array', () => {
        const parent1 = div('parent1')
        const parent2 = div('parent2')
        const root = div('root', parent1, parent2)
        const childNodesArray = Array.from(root.childNodes)

        expect(childNodesArray).to.be.instanceOf(Array)
        expect(childNodesArray).to.eql([parent1, parent2])
      })
    })
  })
})
