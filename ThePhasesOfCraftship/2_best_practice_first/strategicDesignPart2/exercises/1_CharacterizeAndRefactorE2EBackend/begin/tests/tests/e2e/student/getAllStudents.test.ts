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

const feature = loadFeature(
  path.join(__dirname, "../../features/get_all_students.feature")
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
  
    test('Successfully pull all students in the database', ({ given, when, then }) => {
      let allStudents: any;
        let studentInput: any;
        let response: any
        given('students exist in the database', async () => {
            studentInput = await new StudentBuilder(driver)
            .withName("")
            .withRandomEmail("")
            .build()
        });

        when('I request to pull those students by their studentIds', async () => {
            response = await new GetAllStudents(driver).build()
        });

        then('the student should be Successfully created', () => {
          expect(response.body.success).toBe(true)
        });
    });
});
