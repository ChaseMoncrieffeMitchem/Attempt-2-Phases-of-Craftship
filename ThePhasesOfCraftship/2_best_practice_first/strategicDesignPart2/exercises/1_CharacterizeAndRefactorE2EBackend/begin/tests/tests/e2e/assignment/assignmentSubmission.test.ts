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
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";
import { SubmitAssignmentBuilder } from "../../builders/assignment/submitAssignment";

const feature = loadFeature(
  path.join(
    __dirname,
    "../../features/mergeAssignmentWithSubmission.feature"
  )
);

defineFeature(feature, (test) => {
  
  let requestBody: any = {};
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let response: any;
  let studentInput: createStudentDTO;
  let classInput: createClassDTO;
  let assignmentInput: createAssignmentDTO;
  let studentWithAssignmentInput: createStudentAssignmentDTO;

  beforeAll(async () => {
    await webServer.start(3013);
    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3013);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully submitted an assignment", ({ given, when, then }) => {
    let studentId: any;
  let classId: any;
  let assignmentId: any;


    given("an assignment has been given to a student", async () => {
      // Student Creation
      studentInput = await new StudentBuilder(driver)
        .withName("")
        .withRandomEmail("")
        .build();
        studentId = studentInput.studentId;

      // Class Creation
      classInput = await new ClassBuilder(driver).withName("").build();
      classId = classInput.classId;

      // Assignment Creation
      assignmentInput = await new AssignmentBuilder(driver)
        .withTitle("")
        .withClassId(classId)
        .build();
      assignmentId = assignmentInput.assignmentId;

      // Merge Student with Assignment
      studentWithAssignmentInput = await new StudentAssignmentBuilder(driver)
        .withStudentId(studentId)
        .withAssignmentId(assignmentId)
        .build();
    });

    when("I make a request to Submit that assignment", async () => {
      response = await new SubmitAssignmentBuilder(driver).withStudentId(studentId)
      .withAssignmentId(assignmentId)
      .build()
    });

    then(
      "the assignment should be given a successful submission status",
      () => {
        expect(response.studentId).toBeDefined();
      }
    );
  });
});
