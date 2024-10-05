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
  path.join(__dirname, "../../features/enroll_student_in_class.feature")
);

defineFeature(feature, (test) => {
    test('Successfully enrolled a Student into a Classroom', ({ given, when, then }) => {
        given(/^a student exists with the studentId of "(.*)"$/, (arg0) => {

        });

        given(/^a classroom exists witht the classID of "(.*)"$/, (arg0) => {

        });

        when('I request to enroll that student into that classroom', () => {

        });

        then('that student should be enrolled in that classroom', () => {

        });
    });

    test('Failed to enroll a Student inside of a Classroom', ({ given, when, then }) => {
        given('the student is already enrolled in the same classroom', () => {

        });

        when('I request to enroll that student into that classroom', () => {

        });

        then('the enrollment should not take place', () => {

        });
    });
  
});