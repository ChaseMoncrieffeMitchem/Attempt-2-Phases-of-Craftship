// import { createEnrolledStudentDTO } from "../../../../src/shared/dtos/class/enrolledStudentDTO";
// import { StudentBuilder } from "../../builders/student/createStudentBuilder";
// import { ClassBuilder } from "../../builders/class/createClassBuilder";

// export class EnrollmentBuilder {
//   private enrollmentInput: createEnrolledStudentDTO;

//   constructor() {
//     this.enrollmentInput = {
//       studentId: "",
//       classId: "",
//     };
//   }

//   withStudentId(value: string) {
//     // const student = new StudentBuilder().withName("").withRandomEmail("").withStudentId("").build();
//     this.enrollmentInput.studentId = value;
//     return this;
//   }

//   withClassId(value: string) {
//     // const classObj = new ClassBuilder().withName("").withClassId("").build();
//     this.enrollmentInput.classId = value;
//     return this;
//   }

//   build(): createEnrolledStudentDTO {
//     return this.enrollmentInput;
//   }
// }

import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentBuilder } from "../student/createStudentBuilder";
import { ClassBuilder } from "./createClassBuilder";

export class EnrolledStudentBuilder {
  private classId?: string
  private studentId?: string
  private driver: RESTfulAPIDriver;

  constructor(driver: RESTfulAPIDriver) {
    this.driver = driver;
  }

  withClassId (classId: string) {
    this.classId = classId
    return this;
  }

  withStudentId (studentId: string) {
    this.studentId = studentId
    return this
  }

  async build() {
    if (!this.studentId) throw new Error('StudentId not successfully passed');
    if (!this.classId) throw new Error('lassId not successfully passed');


    const enrolledStudent = await this.driver.post('/class-enrollments', {
      classId: this.classId, 
      studentId: this.studentId
    });
    
    const { classId, studentId } = enrolledStudent.body?.data

    return { studentId, classId }
  } 
}