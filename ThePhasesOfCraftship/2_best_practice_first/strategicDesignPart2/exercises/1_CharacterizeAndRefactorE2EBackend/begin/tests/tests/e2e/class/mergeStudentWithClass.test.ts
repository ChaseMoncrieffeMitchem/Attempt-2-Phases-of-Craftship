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
import { EnrollmentBuilder } from "../../builders/class/enrollmentBuilder";

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
  let enrolledStudentInput: createEnrolledStudentDTO;
  let studentId: any;
  let classId: any;

  test("Successfully enrolled a Student into a Classroom", ({
    given,
    when,
    then,
  }) => {
    beforeAll(async () => {
      // Start the Server
      await webServer.start(3006);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3006);
      // Reset the database
    });

    afterAll(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });

    given(
      /^an enrolled student exists with the studentId of "(.*)" and classId of "(.*)"$/,
      async (arg0) => {
        // Create Student
        studentInput = new StudentBuilder()
          .withName("")
          .withRandomEmail("")
          .build();
        const studentResponse = await driver.post("/students", studentInput);
        studentId = studentResponse.body.data.id;

        // Create a class
        classInput = new ClassBuilder().withName("").build();
        const classResponse = await driver.post("/classes", classInput);
        classId = classResponse.body.data.id;

        // Build enrollment input with both IDs
        enrolledStudentInput = new EnrollmentBuilder()
          .withStudentId(studentId)
          .withClassId(classId)
          .build();
          console.log(enrolledStudentInput)
      }
    );


    when("I request to enroll that student into that classroom", async () => {
      response = await driver.post("/class-enrollments", enrolledStudentInput);
      console.log(response)
    });

    then("that student should be enrolled in that classroom", () => {
      expect(response.statusCode).toBe(201);
      expect(response.body.data.studentId).toBe(enrolledStudentInput.studentId);
      expect(response.body.data.classId).toBe(enrolledStudentInput.classId);
    });
  });

  test("Failed to enroll a Student inside of a Classroom", ({
    given,
    when,
    then,
  }) => {
    given("the student is already enrolled in the same classroom", () => {});

    when("I request to enroll that student into that classroom", () => {});

    then("the enrollment should not take place", () => {});
  });
});

