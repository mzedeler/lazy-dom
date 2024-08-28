export interface Consumer {
  getValue: (key: string) => string
  setValue: (key: string, value: string) => void
}
