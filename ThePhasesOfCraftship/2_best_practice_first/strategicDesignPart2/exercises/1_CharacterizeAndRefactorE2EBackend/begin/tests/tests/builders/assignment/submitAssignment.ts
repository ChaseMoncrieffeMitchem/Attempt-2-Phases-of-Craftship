import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentAssignmentBuilder } from "../student/createStudentAssignmentBuilder";
import { AssignmentBuilder } from "./createAssignment Builder";

export class SubmitAssignmentBuilder {
    private studentId?: string
    private assignmentId?: string
    private driver: RESTfulAPIDriver;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    withStudentId (value: string) {
        this.studentId = value
        return this
      }

      withAssignmentId (value: string) {
        this.assignmentId = value
        return this
      }

    async build() {
        if (!this.studentId) throw new Error('Student ID not defined')
        if (!this.assignmentId) throw new Error('Assignment ID not defined')


        const response = await this.driver.post('/student-assignments/submit', {studentId: this.studentId, assignmentId: this.assignmentId})

        const { studentId, assignmentId, status } = response.body?.data

        return { studentId, assignmentId, status }

    }
}