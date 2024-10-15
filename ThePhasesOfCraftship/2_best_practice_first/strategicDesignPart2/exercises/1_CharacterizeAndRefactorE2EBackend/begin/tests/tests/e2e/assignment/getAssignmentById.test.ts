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
import { GetAllStudents } from "../../builders/student/getAllStudentsBuilder";
import { StudentByIdBuilder } from "../../builders/student/studentByIdBuilder";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { AssignmentByIdBuilder } from "../../builders/assignment/assignmentByIdBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/get_assignment_by_id.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start(3017);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3017);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully retrieve assignment by ID", ({ given, when, then }) => {
    let assignmentInput: any
    let response: any
    let classInput: any
    let classId: string
    let assignmentId: string

    given("assignments exist in the database", async () => {
        classInput = await new ClassBuilder(driver).withName("").build()
        classId = classInput.classId

        assignmentInput = await new AssignmentBuilder(driver).withClassId(classId).withTitle("").build()
        assignmentId = assignmentInput.assignmentId
    });

    when("I request to retrieve the assignment by ID", async () => {
        response = await new AssignmentByIdBuilder(driver).withAssignmentId(assignmentId).build()
    });

    then("the assignment should be Successfully retrieved", () => {
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.classId).toBeDefined()
        expect(response.body.data.title).toBeDefined()
    });
  });
});
