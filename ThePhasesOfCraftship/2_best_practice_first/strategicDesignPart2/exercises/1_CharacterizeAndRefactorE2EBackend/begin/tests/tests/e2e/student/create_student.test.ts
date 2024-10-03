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
import { response } from "express";

const feature = loadFeature(
  path.join(__dirname, "../../features/create_student.feature")
);

defineFeature(feature, (test) => {
  test("Successfully created a Student", ({ given, when, then }) => {
    let studentInput: createStudentDTO;
    let response: any;
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;

    beforeEach(async () => {
      // Start the Server
      await webServer.start();

      driver = new RESTfulAPIDriver(webServer.getHttp() as Server);
      // Reset the database
    });

    afterEach(async () => {
      // Stop the processes running on the Server
      await webServer.stop();
    });

    given(/^I want to create a student named "(.*)"$/, () => {
      studentInput = new StudentBuilder()
        .withName("")
        .withRandomEmail("")
        .build();
    });

    when("I request to create that student", async () => {
      response = await driver.post("/students", studentInput);
    });

    then("the student should be Successfully created", () => {
      expect(response.body.success).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.data.name).toEqual(studentInput.name);
      expect(response.body.data.email).toEqual(studentInput.email);
      expect(response.body.data.id).toBeDefined();
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
    let root = new CompositionRoot();
    let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    let studentName: string;
  
    beforeAll(async () => {
      try {
        // Start the Server on port 3001
        await webServer.start(3001);
        console.log("Server started on port 3001");
  
        // Pass the correct port to the driver
        driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3001);
      } catch (error) {
        console.error("Error during server startup:", error);
        throw error;
      }
    });
  
    afterAll(async () => {
      try {
        // Stop the processes running on the Server
        await webServer.stop();
        console.log("Server stopped");
      } catch (error) {
        console.error("Error during server shutdown:", error);
        throw error;
      }
    });
  
    given(/^a student named "(.*)" already exists$/, async (arg0) => {
      try {
        studentInput = new StudentBuilder()
          .withName("")
          .withRandomEmail("")
          .build();

        studentName = studentInput.name
        console.log(studentName)
        response = await driver.post("/students", studentInput);
        console.log(response)
        expect(response.statusCode).toBe(201)
      } catch (error) {
        console.error("Error in creating initial student:", error);
        throw error;
      }
    });
  
    when("I request to create another student with the same name", async () => {
      try {
        studentInput = new StudentBuilder()
          .withName(studentName)
          .withRandomEmail("")
          .build();
          console.log(studentInput)
        response = await driver.post("/students", studentInput);
        console.log(response)
      } catch (error) {
        console.error("Error in creating duplicate student:", error);
        throw error;
      }
    });
  
    then("the creation should fail", () => {
     
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBeTruthy();
    });
  
    and(/^I should receive an error message saying "(.*)"$/, (arg0) => {
      expect(response.body.error).toBe("Student with this name already exists");
    });
  });
  


});
