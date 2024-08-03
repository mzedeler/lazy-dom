import React, { useSyncExternalStore } from 'react'
import { screen, render, act } from '@testing-library/react'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import sinonChai from 'sinon-chai'
import * as chai from 'chai'

chai.use(sinonChai)

describe('Element', () => {
  it('can be instantiated', async () => {
    console.log('heps')
  })
})