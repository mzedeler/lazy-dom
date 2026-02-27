export class Window {
  get location() {
    return {
      href: 'http://localhost:9009/b',
      protocol: 'http:',
      hostname: 'localhost',
      pathname: '/b',
      origin: 'http://localhost:9009',
      search: '',
      hash: '',
    }
  }

  getComputedStyle() {
    return {
      getPropertyValue() {
        return ''
      }
    }
  }

  matchMedia(mediaQueryString: string) {
    return {
      matches: false,
      media: mediaQueryString,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return true },
    }
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
