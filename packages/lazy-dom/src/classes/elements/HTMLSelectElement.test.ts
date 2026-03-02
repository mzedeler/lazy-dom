import { expect } from 'chai'

describe('HTMLSelectElement', () => {
  beforeEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('options', () => {
    it('returns an empty array when there are no options', () => {
      const select = document.createElement('select')
      document.body.appendChild(select)

      expect(select.options).to.have.length(0)
    })

    it('returns option elements as children', () => {
      const select = document.createElement('select')
      const option1 = document.createElement('option')
      option1.setAttribute('value', 'a')
      const option2 = document.createElement('option')
      option2.setAttribute('value', 'b')
      select.appendChild(option1)
      select.appendChild(option2)
      document.body.appendChild(select)

      expect(select.options).to.have.length(2)
      expect(select.options[0].value).to.eq('a')
      expect(select.options[1].value).to.eq('b')
    })

    it('includes options inside optgroup elements', () => {
      const select = document.createElement('select')
      const optgroup = document.createElement('optgroup')
      const option = document.createElement('option')
      option.setAttribute('value', 'nested')
      optgroup.appendChild(option)
      select.appendChild(optgroup)
      document.body.appendChild(select)

      expect(select.options).to.have.length(1)
      expect(select.options[0].value).to.eq('nested')
    })
  })

  describe('selectedIndex', () => {
    it('returns -1 when no option is selected', () => {
      const select = document.createElement('select')
      const option = document.createElement('option')
      select.appendChild(option)
      document.body.appendChild(select)

      expect(select.selectedIndex).to.eq(-1)
    })

    it('returns the index of the selected option', () => {
      const select = document.createElement('select')
      const option1 = document.createElement('option')
      const option2 = document.createElement('option')
      option2.selected = true
      select.appendChild(option1)
      select.appendChild(option2)
      document.body.appendChild(select)

      expect(select.selectedIndex).to.eq(1)
    })
  })

  describe('length', () => {
    it('returns the number of option elements', () => {
      const select = document.createElement('select')
      select.appendChild(document.createElement('option'))
      select.appendChild(document.createElement('option'))
      select.appendChild(document.createElement('option'))
      document.body.appendChild(select)

      expect(select.length).to.eq(3)
    })
  })
})
