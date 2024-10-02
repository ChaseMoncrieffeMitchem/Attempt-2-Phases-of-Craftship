import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { resetDatabase } from "../../reset";
import { StudentBuilder } from "../../student/builders/createStudentBuilder";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { createStudentDTO } from "../../../../src/shared/students/dtos/createStudentDTO";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";

const feature = loadFeature(
  path.join(__dirname, "../../features/create_student.feature")
);

defineFeature(feature, (test) => {

  test('Successfully created a Student', ({ given, when, then }) => {

    let studentInput: createStudentDTO;
    let response: any;
    let root = new CompositionRoot()
    let webServer: WebServer = root.getWebServer()
    let driver: RESTfulAPIDriver;
    

    beforeAll(async () => {
      // Start the Server 
      await webServer.start()

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server)
      // Reset the database
    })

    afterAll(async() => {
      // Stop the processes running on the Server
      await webServer.stop()
    })

    given(/^I want to create a student named "(.*)"$/, () => {
      studentInput = new StudentBuilder()
      .withName("Chase")
      .withRandomEmail()
      .build()

    });

    when('I request to create that student', async () => {
      response = await driver.post("/students", studentInput);
    });

    then('the student should be Successfully created', () => {
      console.log(response)
      expect(response.body.success).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.data.name).toEqual(studentInput.name);
      expect(response.body.data.email).toEqual(studentInput.email);
      expect(response.body.data.id).toBeDefined();
    });



});

  test('Failed to create a student due to a duplicate entry', ({ given, when, then, and }) => {
    given(/^a student named "(.*)" already exists$/, (arg0) => {

    });

    when('I request to create another student with the same name', () => {

    });

    then('the creation should fail', () => {

    });

    and(/^I should receive an error message saying "(.*)"$/, (arg0) => {

    })
  });
})