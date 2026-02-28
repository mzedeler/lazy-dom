"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Window = void 0;
class Window {
    _location = {
        href: 'http://localhost:9009/b',
        protocol: 'http:',
        hostname: 'localhost',
        pathname: '/b',
        origin: 'http://localhost:9009',
        search: '',
        hash: '',
    };
    get location() {
        return this._location;
    }
    set location(value) {
        if (typeof value === 'string') {
            this._location.href = value;
        }
        else {
            Object.assign(this._location, value);
        }
    }
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            }
        };
    }
    matchMedia(mediaQueryString) {
        return {
            matches: false,
            media: mediaQueryString,
            onchange: null,
            addListener() { },
            removeListener() { },
            addEventListener() { },
            removeEventListener() { },
            dispatchEvent() { return true; },
        };
    }
    addEventListener() {
    }
    removeEventListener() {
    }
    get localStorage() {
        return {
            getItem() {
                return null;
            },
            setItem() {
                return;
            }
        };
    }
}
exports.Window = Window;
