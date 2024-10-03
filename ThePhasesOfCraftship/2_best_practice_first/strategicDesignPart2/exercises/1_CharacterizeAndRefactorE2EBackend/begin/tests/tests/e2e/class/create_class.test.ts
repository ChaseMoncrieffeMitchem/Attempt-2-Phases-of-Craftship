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
);

defineFeature(feature, (test) => {


  test("Successfully created a classroom", ({ given, when, then }) => {
    let classInput: createClassDTO;
    let driver: RESTfulAPIDriver;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let response: any;
    beforeEach(async () => {
      // Start the Server
      await webServer.start(3002);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3002);
      // Reset the database
    });

    afterEach(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });

    given(/^I want to create a classroom named "(.*)"$/, (arg0) => {
      classInput = new ClassBuilder().withName("").build();
    });

    when("I request to create that classroom", async () => {
      response = await driver.post("/classes", classInput);
    });

    then("the class should be Successfully created", () => {
      expect(response.body.success).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.data.name).toEqual(classInput.name);
    });
  });

  test("Failed to create a classroom", ({ given, when, then }) => {
    let classInput: createClassDTO;
    let driver: RESTfulAPIDriver;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let response: any;
    let className: string;

    beforeEach(async () => {
      // Start the Server
      await webServer.start(3003);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3003);
      // Reset the database
    });

    afterEach(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });

    given(/^a classroom by name "(.*)" already exists$/, async (arg0) => {
      classInput = new ClassBuilder().withName("").build();
      className = classInput.name;
      response = await driver.post("/classes", classInput);
    });

    when("I request to create a classroom by that same name", async () => {
      classInput = new ClassBuilder().withName(className).build();
      response = await driver.post("/classes", classInput);
    });

    then("the classroom should not be created", () => {
      expect(response.body.success).toBeFalsy();
    });
  });
});
