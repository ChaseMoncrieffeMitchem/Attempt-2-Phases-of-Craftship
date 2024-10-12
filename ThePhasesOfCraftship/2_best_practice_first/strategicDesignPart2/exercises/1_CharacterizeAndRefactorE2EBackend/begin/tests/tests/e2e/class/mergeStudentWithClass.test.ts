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
import { createEnrolledStudentDTO } from "../../../../src/shared/dtos/class/enrolledStudentDTO";
import { EnrolledStudentBuilder } from "../../builders/class/enrollmentBuilder";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { stderr } from "process";

const feature = loadFeature(
  path.join(__dirname, "../../features/enroll_student_in_class.feature")
);

defineFeature(feature, (test) => {
  let studentInput: createStudentDTO;
  let classInput: createClassDTO;
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let response: any;
  let studentId: any;
  let classId: any;
  let enrollmentBuilder: EnrolledStudentBuilder;
  let classBuilder: ClassBuilder;
  let studentBuilder: StudentBuilder;
  let enrolledStudentInput: any
  let assignmentBuilder: AssignmentBuilder

  beforeAll(async () => {
    await webServer.start(3006);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3006);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully enrolled a Student into a Classroom", ({
    given,
    when,
    then,
  }) => {

    given(
      /^an enrolled student exists with the studentId of "(.*)" and classId of "(.*)"$/,
      async (arg0) => {
        // Create instance of a student
        studentBuilder = new StudentBuilder(driver)

        // Create instance of an assignment
        classBuilder = new ClassBuilder(driver)

        // Build enrollment input with both IDs
        enrolledStudentInput = await new EnrolledStudentBuilder(driver)
          .from(classBuilder)
          .and(studentBuilder)
          .build()
      }
    );

    when("I request to enroll that student into that classroom", async () => {
      response = enrolledStudentInput
    });

    then("that student should be enrolled in that classroom", () => {
      expect(response.studentId).toBe(enrolledStudentInput.studentId);
      expect(response.classId).toBe(enrolledStudentInput.classId);
    });
  });

  test("Failed to enroll a Student inside of a Classroom", ({
    given,
    when,
    then,
  }) => {
    let studentName: string

    given(/^a student named "(.*)" already exists$/, async () => {
      studentInput = await new StudentBuilder(driver).withName("").withRandomEmail("").build()
      studentName = studentInput.name
    });

    when(
      "I request to enroll that duplicate student into that classroom",
      async () => {
        studentInput = await new StudentBuilder(driver).withName(studentName).withRandomEmail("").build()
        response = studentInput
      }
    );

    then("the enrollment should not take place", () => {
      expect(response.studentId).toBeUndefined();
    });
  });
});
