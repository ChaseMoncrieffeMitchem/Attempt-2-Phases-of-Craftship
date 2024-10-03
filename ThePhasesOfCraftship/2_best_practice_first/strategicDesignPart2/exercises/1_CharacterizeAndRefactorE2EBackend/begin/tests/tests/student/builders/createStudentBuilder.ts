import { createStudentDTO } from "../../../../src/shared/students/dtos/createStudentDTO"

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class StudentBuilder {

    private studentInput: createStudentDTO
    private name: string = ''
    private email: string = ''

    constructor() {
        this.studentInput = {
            name: '',
            email: ''
        }
    }

    withName (value: string) {
        if (value !== "") return this
        const randomInteger = getRandomNumber(100, 10000)
        this.studentInput.name = `name-${randomInteger}`
        return this
    }

    withRandomEmail (value: string) {
        const randomInteger = getRandomNumber(100, 10000)
        this.studentInput.email = `email-${randomInteger}@gmail.com`
        return this
    }

    build(): createStudentDTO {
        return {
            name: this.studentInput.name,
            email: this.studentInput.email
        }
    }
}