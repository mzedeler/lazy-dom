export type AddObjectCommand = {
  type: 'addObject'
  object: Object
}

export const addObject = (object: Object): AddObjectCommand => ({
  type: 'addObject',
  object
})

