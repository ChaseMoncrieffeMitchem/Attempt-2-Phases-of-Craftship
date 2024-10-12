// import { defineFeature, loadFeature } from "jest-cucumber";
// import path from "path";
// import { StudentBuilder } from "../../builders/student/createStudentBuilder";
// import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
// import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
// import { WebServer } from "../../../../src/shared/http/webServer";
// import { Server } from "http";
// import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
// import { ClassBuilder } from "../../builders/class/createClassBuilder";
// import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
// import { assignmentBuilder } from "../../builders/assignment/createAssignment Builder";
// import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
// import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
// import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";
// import { createStudentGradeDTO } from "../../../../src/shared/dtos/student/createStudentGradeDTO";
// import { StudentGradeBuilder } from "../../builders/student/createStudentGradeBuilder";

// const feature = loadFeature(
//   path.join(__dirname, "../../features/grade_assignment.feature")
// );

// defineFeature(feature, (test) => {
//   let studentAssignmentInput: createStudentAssignmentDTO;
//   let response: any;
//   let root = new CompositionRoot();
//   let webServer: WebServer = root.getWebServer();
//   let driver: RESTfulAPIDriver;
//   let grade: any
//   let studentGradeInput: createStudentGradeDTO;
//   let studentId: any;
//   let requestBody: any = {};
//   let studentInput: createStudentDTO;
//   let classInput: createClassDTO;
//   let classId: any;
//   let assignmentInput: createAssignmentDTO;
//   let assignmentId: any;
//   let studentWithAssignmentInput: createStudentAssignmentDTO;

//   beforeAll(async () => {
//     await webServer.start(3014);
//     driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3014);
//   });

//   afterAll(async () => {
//     await webServer.stop();
//   });

//   test("Successfully have Assignment Graded", ({ given, when, then }) => {
//     given("an assignment has been submitted", async () => {
//         // Student Created
//         studentInput = new StudentBuilder()
//         .withName("")
//         .withRandomEmail("")
//         .withStudentId("")
//         .build();
//       response = await driver.post("/students", studentInput);
//       studentId = response.body.data.id;
//       console.log(studentId)

//         // Class Created
//         classInput = new ClassBuilder().withClassId("").withName("").build();
//       response = await driver.post("/classes", classInput);
//       classId = response.body.data.id;

//         //Assignment Created
//         assignmentInput = new assignmentBuilder()
//         .withClassId(classId)
//         .withTitle("")
//         .withAssignmentId("")
//         .build();

//       response = await driver.post("/assignments", assignmentInput);
//       assignmentId = response.body.data?.id;
//       console.log(assignmentId)

//       // Assignment Given to Student
//       studentWithAssignmentInput = new StudentAssignmentBuilder()
//         .withStudentId(studentId)
//         .withAssignmentId(assignmentId)
//         .build();

//       response = await driver.post(
//         "/student-assignments",
//         studentWithAssignmentInput
//       );

//         // Assignment Submission
//       studentAssignmentInput = new StudentAssignmentBuilder()
//         .withStudentId(studentId)
//         .withAssignmentId(assignmentId)
//         .build();
//         console.log(studentAssignmentInput)

//       response = await driver.post(
//         "/student-assignments/submit",
//         studentAssignmentInput
//       );

//     });

//     when("I make a request to grade that assignment", async () => {

//         // Submitted Assignment gets graded
//         studentGradeInput = new StudentGradeBuilder()
//         .withStudentId(studentId)
//         .withAssignmentId(assignmentId)
//         .withGrade()
//         .build()
//         console.log(studentGradeInput)

//         response = await driver.post("/student-assignments/grade", studentGradeInput)
//         console.log(response)
//     });

//     then("the assignment should be successfully graded", () => {
//         expect(response.statusCode).toBe(200)
//         expect(response.body.data.studentId).toBeDefined()
//         expect(response.body.data.assignmentId).toBeDefined()
//         expect(response.body.data.grade).toBeDefined()
//         expect(response.body.data.status).toBe('submitted')
//     });
//   });
// });

import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { WebServer } from "../../../../src/shared/http/webServer";
import { Server } from "http";
import { CompositionRoot } from "../../../../src/shared/composition/compositionRoot";
// import { ClassRoomBuilder } from "../../builders/class/centralClassRoomBuilder";
import { StudentBuilder } from "../../builders/student/createStudentBuilder";
import { ClassBuilder } from "../../builders/class/createClassBuilder";
import {
  AssignmentBuilder,
} from "../../builders/assignment/createAssignment Builder";
import { StudentAssignmentBuilder } from "../../builders/student/createStudentAssignmentBuilder";
import { StudentGradeBuilder } from "../../builders/student/createStudentGradeBuilder";
import { createStudentGradeDTO } from "../../../../src/shared/dtos/student/createStudentGradeDTO";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { SubmitAssignmentBuilder } from "../../builders/assignment/submitAssignment";

const feature = loadFeature(
  path.join(__dirname, "../../features/grade_assignment.feature")
);

defineFeature(feature, (test) => {
  let response: any;
  let root = new CompositionRoot();
  let webServer: WebServer = root.getWebServer();
  let driver: RESTfulAPIDriver;
  let grade: any;
  let studentGradeInput: createStudentGradeDTO;
  // let classroomBuilder: ClassRoomBuilder;
  let studentId: string;
  let classId: string;
  let assignmentId: string;
  let classInput: createClassDTO;
  let studentInput: createStudentDTO;
  let assignmentInput: createAssignmentDTO;
  let studentBuilder: StudentBuilder;
  let classBuilder: ClassBuilder;
  let assignmentBuilder: AssignmentBuilder;
  let studentAssignmentInput: any
  let submitAssignmentBuilder: SubmitAssignmentBuilder;

  beforeAll(async () => {
    await webServer.start(3014);
    driver = new RESTfulAPIDriver(webServer.getHttp() as Server, 3014);
    // classroomBuilder = new ClassRoomBuilder(driver); // Initialize ClassRoomBuilder
  });

  afterAll(async () => {
    await webServer.stop();
  });

  test("Successfully have Assignment Graded", ({ given, when, then }) => {
    given("an assignment has been submitted", async () => {
      // Using ClassRoomBuilder to handle the creation of class, student, and assignment

      // Create student
      studentInput = await new StudentBuilder(driver)
        .withName("")
        .withRandomEmail("")
        .build();

      // Create class
      classInput = await new ClassBuilder(driver).withName("").build();

      // Create assignment
      assignmentInput = await new AssignmentBuilder(driver)
        .withTitle("")
        .build();

      // Student assigned an assignment
      studentAssignmentInput = await new StudentAssignmentBuilder(driver)
      .with(studentBuilder)
      .and(assignmentBuilder)
      .build()

      // Submit the assignment
      // const studentWithAssignmentInput = new StudentAssignmentBuilder()
      //   .withStudentId(studentId)
      //   .withAssignmentId(assignmentId)
      //   .build();

      //

      // response = await driver.post(
      //   "/student-assignments/submit",
      //   studentWithAssignmentInput
      // );
    });

    when("I make a request to grade that assignment", async () => {
      // Use StudentGradeBuilder to grade the assignment
      studentGradeInput = await new StudentGradeBuilder(driver)
        .from(submitAssignmentBuilder)
        .withGrade()
        .build()

      // response = await driver.post(
      //   "/student-assignments/grade",
      //   studentGradeInput
      // );
    });

    then("the assignment should be successfully graded", () => {
      expect(response.statusCode).toBe(200);
      expect(response.body.data.studentId).toBeDefined();
      expect(response.body.data.assignmentId).toBeDefined();
      expect(response.body.data.grade).toBeDefined();
      expect(response.body.data.status).toBe("submitted");
    });
  });
});
