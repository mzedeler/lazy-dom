export class DOMImplementation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasFeature(_feature: string, _version?: string | null): boolean {
    // DOM Level 2 spec: always returns true
    return true
  }
}
