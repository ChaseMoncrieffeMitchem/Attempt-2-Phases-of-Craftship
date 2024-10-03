import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { WebServer } from "../../../../src/shared/http/webServer";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { Server } from "http";

const feature = loadFeature(
    path.join(__dirname, "../../features/create_class.feature")
)

defineFeature(feature, (test) => {
    let classInput: createClassDTO;
    let driver: RESTfulAPIDriver
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let response: any

    beforeEach(async () => {
        // Start the Server
        await webServer.start();
  
        driver = new RESTfulAPIDriver(webServer.getHttp() as Server);
        // Reset the database
      });
  
      afterEach(async () => {
        // Stop the processes running on the Server
        await webServer.stop();
      });

    test('Successfully created a classroom', ({ given, when, then }) => {
        given(/^I want to create a classroom named "(.*)"$/, (arg0) => {
            classInput = new ClassBuilder()
            .withName("")
            .build()
        });

        when('I request to create that classroom', async () => {
            response = await driver.post('/classes', classInput)
            console.log(response)
        });

        then('the class should be Successfully created', () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.error).toBeFalsy();
            expect(response.body.data.name).toEqual(classInput.name);
        });
    });
})