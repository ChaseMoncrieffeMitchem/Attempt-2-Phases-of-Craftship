import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class StudentBuilder {

    private studentInput: createStudentDTO
    private name: string = ''
    private email: string = ''
    private studentId: string = ''

    constructor() {
        this.studentInput = {
            name: '',
            email: '',
            studentId: ''
        }
    }

    withName (value: string) {
        if (value !== "") return this
        const randomInteger = getRandomNumber(100, 100000)
        this.studentInput.name = `name-${randomInteger}`
        return this
    }

    withRandomEmail (value: string) {
        const randomInteger = getRandomNumber(100, 100000)
        this.studentInput.email = `email-${randomInteger}@gmail.com`
        return this
    }

    withStudentId (value: string) {
        this.studentInput.studentId = value
        return this
    }

    build(): createStudentDTO {
        return {
            name: this.studentInput.name,
            email: this.studentInput.email,
            studentId: this.studentInput.studentId
        }
    }
}