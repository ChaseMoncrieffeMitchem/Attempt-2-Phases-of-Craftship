import { createAssignmentDTO } from "../../../../src/shared/dtos/assignment/create_assignmentDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class assignmentBuilder {
    private assignmentInput: createAssignmentDTO
    private title: string = ""
    private classId: string = ''

    constructor() {
        this.assignmentInput = {
            title: "",
            classId: "",
        }
    }

    withTitle(value: string) {
        if (value) {
            this.assignmentInput.title = value; // Set the title if a value is provided
        } else {
            const randomInteger = getRandomNumber(100, 10000);
            this.assignmentInput.title = `title-${randomInteger}`; // Generate a random title if value is empty
        }
        return this;
    }
    

    withClassId(value: string) {
        this.assignmentInput.classId = value; 
        return this
    }

    build(): createAssignmentDTO {
        return {
            title: this.assignmentInput.title,
            classId: this.assignmentInput.classId
        }
    }
}