import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { ClassBuilder } from "../class/createClassBuilder";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class AssignmentBuilder {
  private assignmentInput: createAssignmentDTO;
  private driver: RESTfulAPIDriver;

  constructor(driver: RESTfulAPIDriver) {
    this.assignmentInput = {
      title: "",
      classId: "",
      assignmentId: ""
    };
    this.driver = driver;
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

  withClassId(value: string) {
    this.assignmentInput.classId = value
    return this
  }

  // withAssignmentId(value: string) {
  //   if (value) {
  //     this.assignmentInput.assignmentId = value;
  //   }
  //   return this;
  // }

  async build(): Promise<createAssignmentDTO> {
    
      const response = await this.driver.post("/assignments", {
        title: this.assignmentInput.title,
        classId: this.assignmentInput.classId,
      });
      this.assignmentInput.assignmentId = response.body.data?.id;
    
    return this.assignmentInput;
  }
}