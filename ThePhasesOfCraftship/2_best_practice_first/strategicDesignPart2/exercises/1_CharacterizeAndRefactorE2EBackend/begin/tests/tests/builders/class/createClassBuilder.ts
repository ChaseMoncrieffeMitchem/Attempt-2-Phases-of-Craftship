import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentBuilder } from "../student/createStudentBuilder";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class ClassBuilder {
  public classInput: createClassDTO;
  private driver: RESTfulAPIDriver;
  // private _classId?: string;

  constructor(driver: RESTfulAPIDriver) {
    this.classInput = {
      name: "",
      classId: "",
    };
    this.driver = driver;
  }

  withName(value: string) {
    if (value) {
      this.classInput.name = value;
    } else {
      const randomInteger = getRandomNumber(100, 100000);
      this.classInput.name = `ClassName-${randomInteger}`;
    }
    console.log("Class Name:", this.classInput.name); 
    return this;
  }

  async build(): Promise<createClassDTO> {
    if (!this.classInput.classId) {
      const response = await this.driver.post("/classes", {
        name: this.classInput.name,
      })
      // this.classInput.name = response.body.data?.name;
      this.classInput.classId = response.body.data?.id; 
    }
    console.log(this.classInput)
    return this.classInput;
  }

  // getClassId(): string {
  //   if (!this._classId) {
  //     throw new Error("Class ID is not available. Please call the build() method first.");
  //   }
  //   return this._classId;
  // }
}

