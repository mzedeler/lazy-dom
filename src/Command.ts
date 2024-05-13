type AddCommand = {
  type: 'addObject',
  object: Object
}

type SetCommand = {
  type: 'setValue'
  object: Object
  property: string
  value: unknown
}

type PushValue = {
  type: 'pushValue'
  object: Array<any>
  value: any
}

export type Command = AddCommand | SetCommand | PushValue
