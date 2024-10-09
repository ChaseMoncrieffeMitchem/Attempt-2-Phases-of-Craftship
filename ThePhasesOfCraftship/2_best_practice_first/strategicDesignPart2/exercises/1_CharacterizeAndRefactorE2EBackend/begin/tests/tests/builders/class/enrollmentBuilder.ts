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
  private classBuilder?: ClassBuilder;
  private studentBuilder?: StudentBuilder;
  private driver: RESTfulAPIDriver;

  constructor(driver: RESTfulAPIDriver) {
    this.driver = driver
  }

  from (classBuilder: ClassBuilder) {
    this.classBuilder = classBuilder;
    return this;
  }

  and (studentBuilder: StudentBuilder) {
    this.studentBuilder = studentBuilder;
    return this;
  }

  async build() {
    if (!this.studentBuilder) throw new Error('You must define the student builder');
    if (!this.classBuilder) throw new Error('You must define the classroom builder');

    let classId = (await this.classBuilder.build()).classId
    let studentId = (await this.studentBuilder.build()).studentId

    const enrolledStudent = await this.driver.post('/class-enrollments', {classId, studentId} )
    
    // const enrolledStudent = await prisma.classEnrollment.upsert({
    //   where: {
    //     studentId_classId: {
    //       studentId: student.id,
    //       classId: classRoom.id
    //     }
    //   },
    //   create: {
    //     studentId: student.id,
    //     classId: classRoom.id
    //   },
    //   update: {
    //     studentId: student.id,
    //     classId: classRoom.id
    //   }
    // });

    return { enrolledStudent }
  }
}