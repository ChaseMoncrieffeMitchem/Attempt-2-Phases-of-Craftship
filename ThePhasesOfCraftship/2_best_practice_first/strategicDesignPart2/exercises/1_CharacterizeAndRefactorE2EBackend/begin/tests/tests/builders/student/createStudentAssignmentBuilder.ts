import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { assignmentBuilder } from "../assignment/createAssignment Builder";
import { ClassBuilder } from "../class/createClassBuilder";
import { StudentBuilder } from "./createStudentBuilder";

export class StudentAssignmentBuilder {
    // private studentAssignmentInput: createStudentAssignmentDTO
    private studentBuilder?: StudentBuilder
    // private classBuilder?: ClassBuilder
    private assignmentBuilder?: assignmentBuilder
    private driver: RESTfulAPIDriver

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    // from (classBuilder: ClassBuilder) {
    //     this.classBuilder = classBuilder
    //     return this
    // }

    with (studentBuilder: StudentBuilder) {
        this.studentBuilder = studentBuilder
        return this
    }

    and (assignmentBuilder: assignmentBuilder) {
        this.assignmentBuilder = assignmentBuilder
        return this
    }

    async build() {
        if(!this.studentBuilder) throw new Error('Student Builder not defined')
        if(!this.assignmentBuilder) throw new Error('Assignment Builder not defined')

        const studentOutput = await this.studentBuilder.build()
        const studentId = studentOutput.studentId

        const assignmentOutput = await this.assignmentBuilder.build()
        const assignmentId = assignmentOutput.assignmentId

        const assignmentsAssignedToStudents = await this.driver.post('/student-assignments', { studentId: studentId, assignmentId: assignmentId })

        return { studentId, assignmentId }
    }
}