import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { ClassBuilder } from "../class/createClassBuilder";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class AssignmentBuilder {
  private assignmentInput: createAssignmentDTO;
  private classBuilder: ClassBuilder;
  private driver: RESTfulAPIDriver;

  constructor(driver: RESTfulAPIDriver, classBuilder: ClassBuilder) {
    this.assignmentInput = {
      title: "",
      classId: "",
      assignmentId: "",
    };
    this.driver = driver;
    this.classBuilder = classBuilder
  }

  withTitle(value: string) {
    if (value) {
      this.assignmentInput.title = value;
    } else {
      const randomInteger = getRandomNumber(100, 10000);
      this.assignmentInput.title = `title-${randomInteger}`;
    }
    return this;
  }

  async withClassId() {
    if (!this.classBuilder) {
      throw new Error("ClassBuilder is not defined.");
    }
    const classId = this.classBuilder.getClassId();
    this.assignmentInput.classId = classId;
    return this;
  }

  withAssignmentId(value: string) {
    if (value) {
      this.assignmentInput.assignmentId = value;
    }
    return this;
  }

  async build(): Promise<createAssignmentDTO> {
    if (!this.assignmentInput.classId) {
      await this.withClassId();
    }

    if (!this.assignmentInput.assignmentId) {
      const response = await this.driver.post("/assignments", {
        title: this.assignmentInput.title,
        classId: this.assignmentInput.classId,
      });
      this.assignmentInput.assignmentId = response.body.data?.id;
    }

    console.log(this.assignmentInput)

    return this.assignmentInput;
  }
}
