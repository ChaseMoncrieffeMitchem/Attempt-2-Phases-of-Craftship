import { Server } from "http"
import { RESTfulAPIDriver } from "./apiDriver"
import { WebServer } from "./webServer"
import { StudentController } from "../../modules/controllers/studentController"
import { ClassController } from "../../modules/controllers/classController"
import { AssignmentController } from "../../modules/controllers/assignmentController"
import { CompositionRoot } from "../composition/compositionRoot"

describe ('webServer', () => {

    let webServer = new CompositionRoot().getWebServer()

    describe('starting and stopping server', () => {
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

    describe('health', () => {

        beforeEach(async () => {
            await webServer.start()
        })
    
        afterEach(async () => {
            await webServer.stop()
        })

        it('can reach the server via outside world using health check API', async () => {
            let driver = new RESTfulAPIDriver(webServer.getHttp() as Server)
            let response = await driver.get('/health')

            expect(response.status).toBe(200)
            expect(response.body.ok).toBeTruthy()
        })
        
    })
})
