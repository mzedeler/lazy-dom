import { expect } from 'chai'

describe('HTMLFormElement', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  describe('requestSubmit', () => {
    it('dispatches a submit event on the form', () => {
      const form = document.createElement('form')
      document.body.appendChild(form)

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      form.requestSubmit()
      expect(submitted).to.equal(true)
    })

    it('dispatches a cancelable submit event', () => {
      const form = document.createElement('form')
      document.body.appendChild(form)

      let cancelable = false
      form.addEventListener('submit', (e: Event) => {
        cancelable = e.cancelable
        e.preventDefault()
      })

      form.requestSubmit()
      expect(cancelable).to.equal(true)
    })

    it('dispatches a bubbling submit event', () => {
      const form = document.createElement('form')
      const div = document.createElement('div')
      div.appendChild(form)
      document.body.appendChild(div)

      let receivedOnParent = false
      div.addEventListener('submit', () => { receivedOnParent = true })

      form.requestSubmit()
      expect(receivedOnParent).to.equal(true)
    })
  })

  describe('elements', () => {
    it('returns form controls inside the form', () => {
      const form = document.createElement('form')
      const input = document.createElement('input')
      const select = document.createElement('select')
      const textarea = document.createElement('textarea')
      const button = document.createElement('button')
      form.appendChild(input)
      form.appendChild(select)
      form.appendChild(textarea)
      form.appendChild(button)
      document.body.appendChild(form)

      expect(form.elements.length).to.equal(4)
      expect(form.length).to.equal(4)
    })
  })

  describe('form property on form-associated elements', () => {
    it('button.form returns the closest form ancestor', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      form.appendChild(button)
      document.body.appendChild(form)

      expect(button.form).to.equal(form)
    })

    it('input.form returns the closest form ancestor', () => {
      const form = document.createElement('form')
      const input = document.createElement('input')
      form.appendChild(input)
      document.body.appendChild(form)

      expect(input.form).to.equal(form)
    })

    it('select.form returns the closest form ancestor', () => {
      const form = document.createElement('form')
      const select = document.createElement('select')
      form.appendChild(select)
      document.body.appendChild(form)

      expect(select.form).to.equal(form)
    })

    it('textarea.form returns the closest form ancestor', () => {
      const form = document.createElement('form')
      const textarea = document.createElement('textarea')
      form.appendChild(textarea)
      document.body.appendChild(form)

      expect(textarea.form).to.equal(form)
    })

    it('returns null when element is not inside a form', () => {
      const button = document.createElement('button')
      document.body.appendChild(button)

      expect(button.form).to.equal(null)
    })
  })

  describe('implicit form submission via submit button click', () => {
    it('dispatches submit event when clicking a submit button', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      button.setAttribute('type', 'submit')
      form.appendChild(button)
      document.body.appendChild(form)

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      button.click()
      expect(submitted).to.equal(true)
    })

    it('dispatches submit event when clicking a child of a submit button', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      button.setAttribute('type', 'submit')
      const span = document.createElement('span')
      span.textContent = 'Submit'
      button.appendChild(span)
      form.appendChild(button)
      document.body.appendChild(form)

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      span.click()
      expect(submitted).to.equal(true)
    })

    it('dispatches submit event for button without explicit type', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      form.appendChild(button)
      document.body.appendChild(form)

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      button.click()
      expect(submitted).to.equal(true)
    })

    it('does not dispatch submit event for button type="button"', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      button.setAttribute('type', 'button')
      form.appendChild(button)
      document.body.appendChild(form)

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      button.click()
      expect(submitted).to.equal(false)
    })

    it('does not dispatch submit event when click is prevented', () => {
      const form = document.createElement('form')
      const button = document.createElement('button')
      button.setAttribute('type', 'submit')
      form.appendChild(button)
      document.body.appendChild(form)

      button.addEventListener('click', (e: Event) => { e.preventDefault() })

      let submitted = false
      form.addEventListener('submit', () => { submitted = true })

      button.click()
      expect(submitted).to.equal(false)
    })
  })
})
