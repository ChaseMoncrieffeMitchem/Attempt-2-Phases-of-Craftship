import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { WebServer } from "../../../../src/shared/http/webServer";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { Server } from "http";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const feature = loadFeature(
  path.join(__dirname, "../../features/create_assignment.feature")
);

defineFeature(feature, (test) => {


  test("Successfully created a assignment", ({ given, when, then }) => {
    let assignmentInput: createAssignmentDTO;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    let response: any;
    let classId: any;

    beforeAll(async () => {
      // Start the Server
      await webServer.start(3010);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3010);
      // Reset the database
    });

    afterAll(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });


    given(/^I want to create a assignment titled "(.*)"$/, async (arg0) => {
      const randomInteger = getRandomNumber(100, 10000);
      response = await driver.post("/classes", {
        name: `Math ${randomInteger}`,
      });
      classId = response.body.data?.id;
      assignmentInput = await new AssignmentBuilder(driver)
        .withTitle("")
        .build();
    });

    when("I request to create that assignment", async () => {
      response = await driver.post("/assignments", assignmentInput);
    });

    then("the assignment should be Successfully created", () => {
      expect(response.body.success).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.data.title).toEqual(assignmentInput.title);
    });
  });

  test("Failed to create a assignment", ({ given, when, then }) => {

    let assignmentInput: createAssignmentDTO;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    let response: any;
    let classId: any;
    let title: string;

    beforeAll(async () => {
      // Start the Server
      await webServer.start(3005);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3005);
      // Reset the database
    });

    afterAll(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });

    given(/^a assignment by title "(.*)" already exists$/, async (arg0) => {
      const randomInteger = getRandomNumber(100, 10000);
      response = await driver.post("/classes", {
        name: `Math ${randomInteger}`,
      });
    //   classId = response.body.data.id;
      assignmentInput = await new AssignmentBuilder(driver)
        .withTitle("")
        .build();
      title = response.body.data?.title
    });

    when("I request to create a assignment by that same title", async () => {
      
      assignmentInput = await new AssignmentBuilder(driver)
        .withTitle("")
        .build();
    });

    then("the assignment should not be created", () => {
      expect(response.created).toBe(false);
    });
  });
});
