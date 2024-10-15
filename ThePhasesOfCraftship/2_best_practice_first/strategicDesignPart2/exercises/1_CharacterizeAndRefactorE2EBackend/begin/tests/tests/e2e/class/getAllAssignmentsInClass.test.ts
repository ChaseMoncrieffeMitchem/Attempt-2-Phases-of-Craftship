import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { AssignmentsInClassBuilder } from "../../builders/class/assignmentsInClassBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/get_all_assignment_in_class.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start(3018);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3018);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test('Successfully retrieve all assignemts in a class', ({ given, when, then }) => {
    let classInput: any
    let classId: string
    let assignmentInput: any
    let response: any

    given('assignments exist in a class', async () => {
        classInput = await new ClassBuilder(driver).withName("").build()
        classId = classInput.classId

        assignmentInput = await new AssignmentBuilder(driver).withClassId(classId).withTitle("").build()
    });

    when('I request to retrieve a class by its ID', async () => {
        response = await new AssignmentsInClassBuilder(driver).withClassId(classId).build()
    });

    then('I should see all of the assignments in that class', () => {
        expect(response.statusCode).toBe(200)
        expect(response.text).toBeDefined()
    });
});
});
