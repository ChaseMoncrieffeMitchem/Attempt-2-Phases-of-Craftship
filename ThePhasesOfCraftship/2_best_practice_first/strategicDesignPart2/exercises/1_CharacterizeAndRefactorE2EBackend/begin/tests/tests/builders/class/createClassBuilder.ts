import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentBuilder } from "../student/createStudentBuilder";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class ClassBuilder {
  private classInput: createClassDTO;
  private driver: RESTfulAPIDriver;

  constructor(driver: RESTfulAPIDriver) {
    this.classInput = {
      name: "",
      classId: "",
    };
    this.driver = driver;
  }

  withName(value: string) {
    if (value !== "") return this;
    const randomInteger = getRandomNumber(100, 100000);
    this.classInput.name = `ClassName-${randomInteger}`;
    return this;
  }

  async withClassId(value: string) {
    if (value) {
      this.classInput.classId = value;
    } else {
      // Call API to create class and get classId if not provided
      const response = await this.driver.post("/classes", {
        name: this.classInput.name,
      });
      this.classInput.classId = response.body.data?.id;
    }
    return this;
  }

  async build(): Promise<createClassDTO> {
    if (!this.classInput.classId) {
      await this.withClassId(""); // This ensures we get a classId from API if not provided
    }
    return this.classInput;
  }
}
