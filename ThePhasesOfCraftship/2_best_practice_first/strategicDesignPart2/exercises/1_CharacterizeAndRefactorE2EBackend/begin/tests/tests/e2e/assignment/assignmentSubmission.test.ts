import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { StudentBuilder } from "../../builders/student/createStudentBuilder";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { assignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";

const feature = loadFeature(
  path.join(
    __dirname,
    "../../features/mergeAssignmentWithSubmission.feature"
  )
);

defineFeature(feature, (test) => {
  let studentId: any;
  let requestBody: any = {};
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let response: any;
  let studentInput: createStudentDTO;
  let classInput: createClassDTO;
  let classId: any;
  let assignmentInput: createAssignmentDTO;
  let assignmentId: any;
  let studentWithAssignmentInput: createStudentAssignmentDTO;

  beforeAll(async () => {
    await webServer.start(3013);
    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3013);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully submitted an assignment", ({ given, when, then }) => {
    given("an assignment has been given to a student", async () => {
      // Student Creation
      studentInput = new StudentBuilder()
        .withName("")
        .withRandomEmail("")
        .withStudentId("")
        .build();
      response = await driver.post("/students", studentInput);
      studentId = response.body.data.id;

      // Class Creation
      classInput = new ClassBuilder().withClassId("").withName("").build();
      response = await driver.post("/classes", classInput);
      classId = response.body.data.id;

      // Assignment Creation
      assignmentInput = new assignmentBuilder()
        .withClassId(classId)
        .withTitle("")
        .withAssignmentId("")
        .build();
      response = await driver.post("/assignments", assignmentInput);
      assignmentId = response.body.data.id;

      // Merge Student with Assignment
      studentWithAssignmentInput = new StudentAssignmentBuilder()
        .withStudentId(studentId)
        .withAssignmentId(assignmentId)
        .build();

      response = await driver.post(
        "/student-assignments",
        studentWithAssignmentInput
      );
    });

    when("I make a request to Submit that assignment", async () => {
      response = await driver.post(
        "/student-assignments/submit",
        studentWithAssignmentInput
      );
      console.log(response);
    });

    then(
      "the assignment should be given a successful submission status",
      () => {
        expect(response.body.data.status).toBe("submitted");
      }
    );
  });
});
