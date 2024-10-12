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
        studentInput = await new StudentBuilder(driver)
          .withName("")
          .withRandomEmail("")
          .build();
        // const studentResponse = await driver.post("/students", studentInput);
        // studentId = studentResponse.body.data.id;

        // Create a class
        classInput = await new ClassBuilder(driver).withName("").build();
        // const classResponse = await driver.post("/classes", classInput);
        // classId = classResponse.body.data.id;

        // Build enrollment input with both IDs
        enrolledStudentInput = await new EnrolledStudentBuilder(driver)
          .from(classBuilder)
          .and(studentBuilder)
          .build()
      }
    );

    when("I request to enroll that student into that classroom", async () => {
      response = await driver.post("/class-enrollments", enrolledStudentInput);
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
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    let response: any;
    let requestBody: any = {};

    beforeAll(async () => {
      // Start the Server
      await webServer.start(3011);

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3011);
      // Reset the database
    });

    afterAll(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });
    given("no student name is passed into the system", () => {
      requestBody = {
        studentId: "",
        classId: classId
      };
    });

    when(
      "I request to enroll that non-student into that classroom",
      async () => {
        response = await driver.post("/class-enrollments", requestBody);
      }
    );

    then("the enrollment should not take place", () => {
      expect(response.statusCode).toBe(404);
    });
  });
});
