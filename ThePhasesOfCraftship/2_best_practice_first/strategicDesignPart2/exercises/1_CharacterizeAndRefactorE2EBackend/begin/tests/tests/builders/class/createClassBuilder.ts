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
    if (value) {
      this.classInput.name = value; // Assign the provided name
    } else {
      const randomInteger = getRandomNumber(100, 100000);
      this.classInput.name = `ClassName-${randomInteger}`; // Fallback to random name
    }
    return this;
  }

  withClassId(value: string) {
    if (value) {
      this.classInput.classId = value;
    }
    return this;
  }

  async build(): Promise<createClassDTO> {
    // If classId is not set, make an API call to create a class
    if (!this.classInput.classId) {
      const response = await this.driver.post("/classes", {
        name: this.classInput.name,
      });

      // Assign the classId from the response
      this.classInput.classId = response.body.data?.id; // Ensure the API response contains the id
    }

    return this.classInput; // Return the constructed class input
  }
}
