import initialisePlugin from '../src/initialisePlugin'
import type { AMDExport } from '../src/utils'

describe('initialisePlugin', () => {
    it('should allow to load a scoped service plugin', () => {
        const Service = (initialisePlugin('foobar', 'service') as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.foo).toBe('foobar')
    })

    it('should allow to load unscoped service plugin from wdio', () => {
        const Service = (initialisePlugin('@wdio/foobar-service', 'service') as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.foo).toBe('foobar')
    })

    it('should allow to load unscoped service plugin', () => {
        const Service = (initialisePlugin('test', 'service') as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.foo).toBe('bar')
    })

    it('should allow to load scoped services', () => {
        const Service = (initialisePlugin('@saucelabs/wdio-foobar-reporter', 'reporter') as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.foo).toBe('barfoo')
    })

    it('should allow to load service referenced with an absolute path', () => {
        const path = require.resolve(__dirname + '/__mocks__/@saucelabs/wdio-foobar-reporter')
        const Service = (initialisePlugin(path) as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.foo).toBe('barfoo')
    })

    it('should prefer scoped over unscoped packages', () => {
        const Service = (initialisePlugin('scoped', 'service') as AMDExport).default
        const service = new Service({}, {}, {})
        expect(service.isScoped).toBe(true)
    })

    it('should throw meaningful error message', () => {
        expect(() => initialisePlugin('lala', 'service'))
            .toThrow(/Please make sure you have it installed!/)
        expect(() => initialisePlugin('borked', 'framework'))
            .toThrow(/Error: foobar/)
        expect(() => initialisePlugin('foobar'))
            .toThrow(/No plugin type provided/)
    })
})