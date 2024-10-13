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

const feature = loadFeature(
  path.join(__dirname, "../../features/get_student_by_id.feature")
);

defineFeature(feature, (test) => {
    let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
    let driver: RESTfulAPIDriver;
    test('Successfully retrieve a student by StudentID', ({ given, when, then }) => {
        let studentInput: any
        let studentById: any
        let studentId: any
        let response: any

        beforeAll(async () => {
            await webServer.start(3015);
        
            driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3015);
          });
        
          afterAll(async () => {
            await webServer.stop();
          });

        given('students exist in the database', async () => {
            studentInput = await new StudentBuilder(driver)
            .withName("")
            .withRandomEmail("")
            .build()
            studentId = studentInput.studentId
            console.log(studentId)
        });

        when('I make a request to get a student by their StudentID', async () => {
            response = await new StudentByIdBuilder(driver).withStudentId(studentId).build()
            console.log(response)
        });

        then('that student should be retrieved by their StudentID', () => {
            expect(response.data?.id).toBeDefined()
            expect(response.data?.name).toBeDefined()
            expect(response.data?.email).toBeDefined()
        });
    });
});
