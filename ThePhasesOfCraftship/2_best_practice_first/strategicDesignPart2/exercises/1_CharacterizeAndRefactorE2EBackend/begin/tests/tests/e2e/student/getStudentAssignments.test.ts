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
import { EnrolledStudentBuilder } from "../../builders/class/enrollmentBuilder";

const feature = loadFeature(
  path.join(__dirname, "../../features/student_submitted_assignments.feature")
);

defineFeature(feature, (test) => {
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;

  beforeAll(async () => {
    await webServer.start(3019);

    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3019);
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully retrieve student assignments by studentId", ({
    given,
    when,
    then,
  }) => {
    let classInput: any;
    let classId: string;
    let assignmentInput: any;
    let response: any;
    let studentInput: any
    let studentId: any
    let assignmentId: string
    let studentAssignment: any
    let enrollStudent: any

    given("students have assignments belonging to them", async () => {
        studentInput = await new StudentBuilder(driver).withName("").withRandomEmail("").build()
        studentId = studentInput.studentId

        classInput = await new ClassBuilder(driver).withName("").build()
        classId = classInput.classId

        enrollStudent = await new EnrolledStudentBuilder(driver).withClassId(classId).withStudentId(studentId).build()

        assignmentInput = await new AssignmentBuilder(driver).withClassId(classId).withTitle("").build()
        assignmentId = assignmentInput.assignmentId

        studentAssignment = await new StudentAssignmentBuilder(driver).withStudentId(studentId).withAssignmentId(assignmentId).build()
    });

    when("I request to retrieve those student assignments", async () => {
        response = await new GetStudentAssignmentsBuilder(driver).withStudentId(studentId).build()
        console.log(response)
    });

    then("I should see all of the assignments for that student", () => {
        expect(response.statusCode).toBe(200)
    });
  });
});
