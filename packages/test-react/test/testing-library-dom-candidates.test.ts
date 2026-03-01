import { screen } from '@testing-library/dom'
import { expect } from 'chai'

describe('@testing-library/dom candidates', () => {
  afterEach(() => {
    document.body.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('screen.queryByRole', () => {
    it('role=heading using h1', () => {
      const h1 = document.createElement('h1')
      h1.appendChild(document.createTextNode('Title'))
      document.body.appendChild(h1)

      expect(screen.queryByRole('heading')).to.eq(h1)
    })

    it('role=link using a[href]', () => {
      const a = document.createElement('a')
      a.setAttribute('href', 'https://example.com')
      a.appendChild(document.createTextNode('Click'))
      document.body.appendChild(a)

      expect(screen.queryByRole('link')).to.eq(a)
    })

    it('role=list using ul', () => {
      const ul = document.createElement('ul')
      const li = document.createElement('li')
      li.appendChild(document.createTextNode('item'))
      ul.appendChild(li)
      document.body.appendChild(ul)

      expect(screen.queryByRole('list')).to.eq(ul)
    })

    it('role=textbox using input', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'text')
      document.body.appendChild(input)

      expect(screen.queryByRole('textbox')).to.eq(input)
    })

    it('role=button with name filter', () => {
      const button = document.createElement('button')
      button.appendChild(document.createTextNode('Save'))
      document.body.appendChild(button)

      expect(screen.queryByRole('button', { name: 'Save' })).to.eq(button)
    })

    it('role=button returns null when no buttons exist', () => {
      const div = document.createElement('div')
      div.appendChild(document.createTextNode('not a button'))
      document.body.appendChild(div)

      expect(screen.queryByRole('button')).to.be.null
    })

    it('role=checkbox using input[type=checkbox]', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'checkbox')
      document.body.appendChild(input)

      expect(screen.queryByRole('checkbox')).to.eq(input)
    })
  })

  describe('screen.queryByPlaceholderText', () => {
    it('finds input by placeholder', () => {
      const input = document.createElement('input')
      input.setAttribute('placeholder', 'Enter name')
      document.body.appendChild(input)

      expect(screen.queryByPlaceholderText('Enter name')).to.eq(input)
    })
  })

  describe('screen.queryByLabelText', () => {
    it('finds input by label with for attribute', () => {
      const label = document.createElement('label')
      label.setAttribute('for', 'name-input')
      label.appendChild(document.createTextNode('Name'))
      const input = document.createElement('input')
      input.setAttribute('id', 'name-input')
      document.body.appendChild(label)
      document.body.appendChild(input)

      expect(screen.queryByLabelText('Name')).to.eq(input)
    })
  })

  describe('screen.queryByDisplayValue', () => {
    it('finds input by its current value', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'text')
      // In a real DOM, setting .value sets the displayed value
      input.value = 'hello world'
      document.body.appendChild(input)

      expect(screen.queryByDisplayValue('hello world')).to.eq(input)
    })
  })
})
