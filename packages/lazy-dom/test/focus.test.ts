import { expect } from 'chai'

describe('focus management', () => {
  afterEach(() => {
    document.body?.childNodes.forEach(childNode => document.body.removeChild(childNode))
  })

  it('dispatches blur and focusout on previously focused element when another gains focus', () => {
    const inputA = document.createElement('input')
    const inputB = document.createElement('input')
    document.body.appendChild(inputA)
    document.body.appendChild(inputB)

    const events: string[] = []
    inputA.addEventListener('blur', () => events.push('blur'))
    inputA.addEventListener('focusout', () => events.push('focusout'))
    inputB.addEventListener('focus', () => events.push('focus'))
    inputB.addEventListener('focusin', () => events.push('focusin'))

    inputA.focus()
    events.length = 0

    inputB.focus()

    expect(events).to.include('blur')
    expect(events).to.include('focusout')
    expect(events).to.include('focus')
    expect(events).to.include('focusin')
  })

  it('sets relatedTarget on blur events to the newly focused element', () => {
    const inputA = document.createElement('input')
    const inputB = document.createElement('input')
    document.body.appendChild(inputA)
    document.body.appendChild(inputB)

    let blurRelatedTarget: unknown = undefined
    inputA.addEventListener('blur', (e: Event) => {
      blurRelatedTarget = (e as FocusEvent).relatedTarget
    })

    inputA.focus()
    inputB.focus()

    expect(blurRelatedTarget).to.equal(inputB)
  })

  it('updates document.activeElement correctly', () => {
    const inputA = document.createElement('input')
    const inputB = document.createElement('input')
    document.body.appendChild(inputA)
    document.body.appendChild(inputB)

    inputA.focus()
    expect(document.activeElement).to.equal(inputA)

    inputB.focus()
    expect(document.activeElement).to.equal(inputB)
  })
})
