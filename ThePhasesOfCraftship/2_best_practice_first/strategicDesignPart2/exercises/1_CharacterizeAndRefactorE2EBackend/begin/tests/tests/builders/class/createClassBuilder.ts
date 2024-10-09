import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO";
import { createClassDTO } from "../../../../src/shared/dtos/class/createClassDTO";
import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentBuilder } from "../student/createStudentBuilder";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class ClassBuilder {
    private classInput: createClassDTO
    private name: string = ""
    private classId: string = ''

    constructor() {
        this.classInput = {
            name: '',
            classId: ''
        }
    }

    withName (value: string) {
    if (value !== "") return this
    const randomInteger = getRandomNumber(100, 100000)
    this.classInput.name = `ClassName-${randomInteger}`
    return this
   }

   withClassId(value: string) {
    this.classInput.classId = value;
    return this;
  }

   build(): createClassDTO {
    return {
        name: this.classInput.name,
        classId: this.classInput.classId
    }
   }
}

