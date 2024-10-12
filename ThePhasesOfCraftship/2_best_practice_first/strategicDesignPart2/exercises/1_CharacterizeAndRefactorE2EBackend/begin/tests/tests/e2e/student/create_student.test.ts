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

const feature = loadFeature(
  path.join(__dirname, "../../features/create_student.feature")
);

defineFeature(feature, (test) => {

  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start();

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully created a Student", ({ given, when, then }) => {
    let studentInput: createStudentDTO;
    let response: any;

    given(/^I want to create a student named "(.*)"$/, async () => {
      studentInput = await new StudentBuilder(driver)
        .withName("")
        .withRandomEmail("")
        .build();
    });

    when("I request to create that student", async () => {
      response = studentInput
    });

    then("the student should be Successfully created", () => {
      expect(response.name).toEqual(studentInput.name);
      expect(response.email).toEqual(studentInput.email);
      expect(response.studentId).toBeDefined();
    });
  });

  test("Failed to create a student due to a duplicate entry", ({
    given,
    when,
    then,
    and,
  }) => {
    let studentInput: createStudentDTO;
    let response: any;
    let studentName: string;
  
    given(/^a student named "(.*)" already exists$/, async (arg0) => {
        studentInput = await new StudentBuilder(driver)
          .withName("")
          .withRandomEmail("")
          .build()

        studentName = studentInput.name
    });
  
    when("I request to create another student with the same name", async () => {
        studentInput = await new StudentBuilder(driver)
          .withName(studentName)
          .withRandomEmail("")
          .build();
          response = studentInput
    });
  
    then("the creation should fail", () => {
      expect(response.name).toBe(studentInput.name);
      expect(response.studentId).toBeUndefined();
    });
  
  });
    });
