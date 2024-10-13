import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class StudentBuilder {
  public studentInput: createStudentDTO;
  private driver: RESTfulAPIDriver;
  private _studentId?: string;

  constructor(driver: RESTfulAPIDriver) {
    this.studentInput = {
      name: "",
      email: "",
      studentId: "",
    };
    this.driver = driver;
  }

  withName(value: string) {
    if (value) {
      this.studentInput.name = value;
    } else {
      const randomInteger = getRandomNumber(100, 100000);
      this.studentInput.name = `name-${randomInteger}`;
    }
    return this;
  }

  withRandomEmail(value: string) {
    const randomInteger = getRandomNumber(100, 100000);
    this.studentInput.email = `email-${randomInteger}@gmail.com`;
    return this;
  }

  async build(): Promise<createStudentDTO> {
    // If studentId is not provided, make the API call to create a student
    if (!this.studentInput.studentId) {
      const response = await this.driver.post("/students", {
        name: this.studentInput.name,
        email: this.studentInput.email,
      });
      this.studentInput.studentId = response.body.data?.id; // Set the studentId from the API response
      this._studentId = this.studentInput.studentId; // Store the studentId in the private property
    }
    return this.studentInput; // Return the constructed student input
  }

  getStudentId(): string {
    if (!this._studentId) {
      throw new Error("Student ID is not available. Please call the build method first.");
    }
    return this._studentId;
  }

}
