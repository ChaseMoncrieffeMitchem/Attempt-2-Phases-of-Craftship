import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { resetDatabase } from "../../reset";
import { StudentBuilder } from "../../builders/student/createStudentBuilder";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { response } from "express";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { assignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";
import { EnrollmentBuilder } from "../../builders/class/enrollmentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/connect_student_with_assignment.feature")
);

defineFeature(feature, (test) => {
  let studentId: any;
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
    let classInput: createClassDTO;
    let classId: any;
    let assignmentInput: createAssignmentDTO;
    let assignmentId: any;
    let studentWithAssignmentInput: createStudentAssignmentDTO;
    let studentInput: createStudentDTO;

    given("a student exists", async () => {
      studentInput = new StudentBuilder()
        .withName("")
        .withRandomEmail("")
        .withStudentId("")
        .build();
      response = await driver.post("/students", studentInput);
      studentId = response.body.data.id;
    });

    and("an assignment exists", async () => {
      // Create a Class so ClassId is obtained
      classInput = new ClassBuilder().withClassId("").withName("").build();
      response = await driver.post("/classes", classInput);
      classId = response.body.data.id;

      // Create an Assignment
      assignmentInput = new assignmentBuilder()
        .withClassId(classId)
        .withTitle("")
        .withAssignmentId("")
        .build();
      response = await driver.post("/assignments", assignmentInput);
      assignmentId = response.body.data.id;
    });

    when("I request to assign that assignment to the student", async () => {
      studentWithAssignmentInput = new StudentAssignmentBuilder()
        .withStudentId(studentId)
        .withAssignmentId(assignmentId)
        .build();

      response = await driver.post(
        "/student-assignments",
        studentWithAssignmentInput
      );
    });

    then("the student should be successfully assigned that Assignement", () => {
      expect(response.statusCode).toBe(201);
    });
  });

  test("Failed to give an Assignment to Student b/c assignment Does Not Exist", ({
    given,
    when,
    then,
  }) => {
    given("an assignment Does not exist", () => {
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
