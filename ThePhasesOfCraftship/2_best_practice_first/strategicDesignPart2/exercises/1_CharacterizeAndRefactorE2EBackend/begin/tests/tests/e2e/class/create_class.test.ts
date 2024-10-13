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
  let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;


  beforeAll(async () => {
    await webServer.start(3002);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3002);
  });

  afterAll(async () => {
    await webServer.stop();
  });


  test("Successfully created a classroom", ({ given, when, then }) => {
    let classInput: createClassDTO;
    
    let response: any;
    

    given(/^I want to create a classroom named "(.*)"$/, async (arg0) => {
      classInput = await new ClassBuilder(driver).withName("").build();
    });
  
    when("I request to create that classroom", async () => {
      response = classInput
    });

    then("the class should be Successfully created", () => {
      expect(response.classId).toBeDefined();
    });
  });

  test("Failed to create a classroom", ({ given, when, then }) => {
    let classInput: createClassDTO;
    let response: any;
    let className: string;


    given(/^a classroom by name "(.*)" already exists$/, async (arg0) => {
      classInput = await new ClassBuilder(driver).withName("").build();
      className = classInput.name;
    });

    when("I request to create a classroom by that same name", async () => {
      classInput = await new ClassBuilder(driver).withName(className).build();
      response = classInput
    });

    then("the classroom should not be created", () => {
      expect(response.classId).toBeUndefined();
    });
  });
});
