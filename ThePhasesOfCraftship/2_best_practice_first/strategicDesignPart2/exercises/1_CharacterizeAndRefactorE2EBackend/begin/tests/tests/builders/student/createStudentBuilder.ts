import { createStudentDTO } from "../../../../src/shared/dtos/student/createStudentDTO"
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  

export class StudentBuilder {

    private studentInput: createStudentDTO
    private driver: RESTfulAPIDriver;

    constructor(driver: RESTfulAPIDriver) {
        this.studentInput = {
            name: '',
            email: '',
            studentId: ''
        }
        this.driver = driver
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

    async withStudentId (value: string) {
        if (value) {
            return this.studentInput.studentId
        } else {
            const response = await this.driver.post('/students', {name: this.studentInput.name, email: this.studentInput.email})
            this.studentInput.studentId = response.body.data?.id
        }

        return this
    }

    async build(): Promise<createStudentDTO> {
        if (!this.studentInput.studentId) {
            await this.withStudentId("")
        }
        return this.studentInput
    }
}