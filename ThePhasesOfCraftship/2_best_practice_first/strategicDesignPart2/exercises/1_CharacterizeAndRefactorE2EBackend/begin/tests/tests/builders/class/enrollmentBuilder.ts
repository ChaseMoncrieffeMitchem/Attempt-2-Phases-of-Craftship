import { createEnrolledStudentDTO } from "../../../../src/shared/dtos/class/enrolledStudentDTO";
import { StudentBuilder } from "../../builders/student/createStudentBuilder";
import { ClassBuilder } from "../../builders/class/createClassBuilder";

export class EnrollmentBuilder {
  private enrollmentInput: createEnrolledStudentDTO;

  constructor() {
    this.enrollmentInput = {
      studentId: "",
      classId: "",
    };
  }

  withStudentId(value: string) {
    // const student = new StudentBuilder().withName("").withRandomEmail("").withStudentId("").build();
    this.enrollmentInput.studentId = value;
    return this;
  }

  withClassId(value: string) {
    // const classObj = new ClassBuilder().withName("").withClassId("").build();
    this.enrollmentInput.classId = value;
    return this;
  }

  build(): createEnrolledStudentDTO {
    return this.enrollmentInput;
  }
}
