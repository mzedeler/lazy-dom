const initialState = {
  objects: [],
  values: new WeakMap()
}

export const reducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'addObject':
      state.objects.push(action.object)
      return state
    case 'setValue':
      const values = state.values.get(action.object) || {}
      values[action.property] = action.value
      state.values.set(action.object, values)
      return state
  }

  return state
}
