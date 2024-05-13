type State = {
  objects: Object[],
  values: WeakMap<Object, Record<string, unknown>>
}

const initialState: State = {
  objects: [],
  values: new WeakMap()
}

import type { Command } from './Command'

export const reducer = (state: State = initialState, command?: Command) => {
  switch (command?.type) {
    case 'addObject':
      state.objects.push(command.object)
      return state
    case 'setValue':
      const values = state.values.get(command.object) || {}
      values[command.property] = command.value
      state.values.set(command.object, values)
      return state
    case 'pushValue':
      (command.object as Array<any>).push(command.value)
      return state
  }

  return state
}
