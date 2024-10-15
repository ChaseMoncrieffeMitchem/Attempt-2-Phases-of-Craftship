import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
import { AssignmentBuilder } from "../../builders/assignment/createAssignment Builder";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import { AssignmentsInClassBuilder } from "../../builders/class/assignmentsInClassBuilder";
import { StudentBuilder } from "../../builders/student/createStudentBuilder";
import { GetStudentAssignmentsBuilder } from "./getAllStudentAssignments";
import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
import { SubmitAssignmentBuilder } from "../../builders/assignment/submitAssignment";
import { EnrolledStudentBuilder } from "../../builders/class/enrollmentBuilder";
import { StudentGradeBuilder } from "../../builders/student/createStudentGradeBuilder";
import { GetStudentGradeBuilder } from "../../builders/student/getStudentGradeBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/get_all_student_grades.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start(3020);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3020);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  let classInput: any;
  let classId: string;
  let assignmentInput: any;
  let response: any;
  let studentInput: any;
  let studentId: any;
  let assignmentId: string;
  let studentAssignment: any;
  let assignmentSubmission: any
  let enrollStudent: any;
  let gradeSubmission: any

  test("Successfully retrieve student grades", ({ given, when, then }) => {
    given("a student has grades in the database", async () => {
      studentInput = await new StudentBuilder(driver)
        .withName("")
        .withRandomEmail("")
        .build();
      studentId = studentInput.studentId;

      classInput = await new ClassBuilder(driver).withName("").build();
      classId = classInput.classId;

      enrollStudent = await new EnrolledStudentBuilder(driver).withClassId(classId).withStudentId(studentId).build()

      assignmentInput = await new AssignmentBuilder(driver)
        .withClassId(classId)
        .withTitle("")
        .build();
      assignmentId = assignmentInput.assignmentId;

      studentAssignment = await new StudentAssignmentBuilder(driver)
        .withStudentId(studentId)
        .withAssignmentId(assignmentId)
        .build();

        assignmentSubmission = await new SubmitAssignmentBuilder(driver).withStudentId(studentId).withAssignmentId(assignmentId).build()

        gradeSubmission = await new StudentGradeBuilder(driver).withStudentId(studentId).withAssignmentId(assignmentId).withGrade().build()
    });

    when("I request to retrieve those grades", async () => {
        response = await new GetStudentGradeBuilder(driver).withStudentId(studentId).build()
    });

    then("I should see all of the grades for that student", () => {
        expect(response.statusCode).toBe(200)
    });
  });
});
