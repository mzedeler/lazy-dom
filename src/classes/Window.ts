export class Window {
  get location() {
    return {
      href: 'http://localhost:9009/b'
    }
  }

  getComputedStyle() {
    return {
      getPropertyValue() {
        return ''
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  matchMedia(mediaQueryString: string) {
    return true
  }

  addEventListener() {

  }

  removeEventListener() {

  }

  get localStorage() {
    return {
      getItem() {
        return null
      },
      setItem() {
        return
      }
    }
  }
}
