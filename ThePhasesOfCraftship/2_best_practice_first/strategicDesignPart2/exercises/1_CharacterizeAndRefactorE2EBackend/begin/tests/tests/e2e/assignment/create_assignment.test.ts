import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { WebServer } from "../../../../src/shared/http/webServer";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { Server } from "http";
import { ClassBuilder } from "../../builders/class/createClassBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/create_assignment.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let classBuilder: ClassBuilder

  beforeAll(async () => {
    await webServer.start(3010);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3010);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully created a assignment", ({ given, when, then }) => {
    let assignmentInput: createAssignmentDTO;
    let response: any;

    given(/^I want to create a assignment titled "(.*)"$/, async (arg0) => {
      classBuilder = new ClassBuilder(driver)

      assignmentInput = await new AssignmentBuilder(driver, classBuilder)
        .withTitle("")
        .build();
    });

    when("I request to create that assignment", async () => {
      response = assignmentInput
    });

    then("the assignment should be Successfully created", () => {
      expect(response.title).toBe(assignmentInput.title);
      expect(response.classId).toBe(assignmentInput.classId);
      expect(response.assignmentId).toBe(assignmentInput.assignmentId);
    });
  });

  test("Failed to create a assignment", ({ given, when, then }) => {
    let assignmentInput: createAssignmentDTO;
    let response: any;
    let assignmentTitle: string;

    given(/^a assignment by title "(.*)" already exists$/, async (arg0) => {
      classBuilder = new ClassBuilder(driver)
      assignmentInput = await new AssignmentBuilder(driver, classBuilder)
        .withTitle("")
        .build();
        assignmentTitle = assignmentInput.title
    });

    when("I request to create a assignment by that same title", async () => {
      assignmentInput = await new AssignmentBuilder(driver, classBuilder)
        .withTitle(assignmentTitle)
        .build();
        response = assignmentInput
    });

    then("the assignment should not be created", () => {
      expect(response.assignmentId).toBeUndefined()
    });
  });
});
