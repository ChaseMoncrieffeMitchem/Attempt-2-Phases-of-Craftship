import { WebServer } from "./webServer"

describe ('webServer', () => {

    let webServer = new WebServer()

    beforeEach(async () => {
        await webServer.stop()
    })

    afterEach(async () => {
        await webServer.stop()
    })

    it('can start', async () => {
        await webServer.start()
        expect(webServer.isStarted()).toBeTruthy()
    })

    test('once started, it can stop', async () => {
        await webServer.start()
        await webServer.stop()
        expect(webServer.isStarted()).toBeFalsy()
    })
})
