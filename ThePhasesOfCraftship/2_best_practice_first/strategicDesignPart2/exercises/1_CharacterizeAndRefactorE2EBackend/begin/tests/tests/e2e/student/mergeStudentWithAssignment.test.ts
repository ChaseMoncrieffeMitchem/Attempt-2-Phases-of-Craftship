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
import { EnrolledStudentBuilder } from "../../builders/class/enrollmentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/connect_student_with_assignment.feature")
);

defineFeature(feature, (test) => {
  let requestBody: any = {};
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let response: any;

  beforeAll(async () => {
    await webServer.start(3012);
    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3012);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully give Assignment to Student", ({
    given,
    and,
    when,
    then,
  }) => {

    let classInput: any;
    let classId: any;
    let assignmentInput: createAssignmentDTO;
    let studentWithAssignmentInput: createStudentAssignmentDTO;
    let studentEnrollmentInput: any
    let classBuilder: any
    let studentBuilder: any
    let assignmentId: any
    let studentAssignmentInput: any
    let studentId: any;

    given("a student has been given an assignment", async () => {
      response = await new StudentBuilder(driver).withName("").withRandomEmail("").build()
      console.log(response)
      studentId = response.studentId

      response = await new ClassBuilder(driver).withName("").build()
      console.log(response)
      classId = response.classId

      response = await new AssignmentBuilder(driver).withTitle("").withClassId(classId).build()
      console.log(response)
      assignmentId = response.assignmentId

      studentAssignmentInput = await new StudentAssignmentBuilder(driver)
      .withStudentId(studentId)
      .withAssignmentId(assignmentId)
      .build()
      console.log(studentAssignmentInput)
    });

    when("I request to assign that assignment to the student", async () => {
      response = studentAssignmentInput
      console.log(response)
    });

    then("the student should be successfully assigned that Assignement", () => {
      expect(response.studentId).toBeDefined();
      expect(response.assignmentId).toBeDefined()
    });
  });

  test("Failed to give an Assignment to Student b/c assignment Does Not Exist", ({
    given,
    when,
    then,
  }) => {
    given("an assignment Does not exist", (studentId) => {
      requestBody = {
        studentId: studentId,
        assignmentId: "",
      };
    });

    when("I request to assign that non-assignment to the student", async () => {
      response = await driver.post("/class-enrollments", requestBody);
    });

    then("the student should not be assigned that Assignement", () => {
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
