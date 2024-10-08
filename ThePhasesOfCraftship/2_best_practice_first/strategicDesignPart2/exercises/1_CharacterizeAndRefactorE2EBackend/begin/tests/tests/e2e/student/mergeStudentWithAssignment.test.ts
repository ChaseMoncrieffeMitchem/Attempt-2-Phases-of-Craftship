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

const feature = loadFeature(
  path.join(__dirname, "../../features/connect_student_with_assignment.feature")
);

defineFeature(feature, (test) => {
  test("Successfully give Assignment to Student", ({
    given,
    and,
    when,
    then,
  }) => {
    let response: any;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    let classInput: createClassDTO;
    let classId: any;
    let studentId: any;
    let assignmentInput: createAssignmentDTO;
    let assignmentId: any;
    let studentWithAssignmentInput: createStudentAssignmentDTO;
    let studentInput: createStudentDTO;

    beforeAll(async () => {
      await webServer.start(3012);
      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3012);
    });

    afterAll(async () => {
      await webServer.stop();
    });

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
      console.log(response);
    });

    then("the student should be successfully assigned that Assignement", () => {
      expect(response.statusCode).toBe(201);
    });
  });
});
