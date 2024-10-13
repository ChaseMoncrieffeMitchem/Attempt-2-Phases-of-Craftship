import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { AssignmentBuilder } from "../assignment/createAssignment Builder";
import { ClassBuilder } from "../class/createClassBuilder";
import { StudentBuilder } from "./createStudentBuilder";

export class StudentAssignmentBuilder {
    // private studentAssignmentInput: createStudentAssignmentDTO
    private studentId?: string
    // private classBuilder?: ClassBuilder
    private assignmentId?: string
    private driver: RESTfulAPIDriver

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
        if(!this.studentId) throw new Error('Student Builder not defined')
        if(!this.assignmentId) throw new Error('Assignment Builder not defined')

        const assignmentsAssignedToStudents = await this.driver.post('/student-assignments', { studentId: this.studentId, assignmentId: this.assignmentId })

        const { studentId, assignmentId } = assignmentsAssignedToStudents.body?.data

        return { studentId, assignmentId }
    }
}