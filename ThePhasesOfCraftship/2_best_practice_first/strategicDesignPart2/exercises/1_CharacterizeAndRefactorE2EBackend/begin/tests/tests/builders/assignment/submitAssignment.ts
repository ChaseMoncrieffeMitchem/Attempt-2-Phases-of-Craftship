import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentAssignmentBuilder } from "../student/createStudentAssignmentBuilder";
import { AssignmentBuilder } from "./createAssignment Builder";

export class SubmitAssignmentBuilder {
    private studentAssignmentBuilder?: StudentAssignmentBuilder
    private driver: RESTfulAPIDriver;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    from(studentAssignmentBuilder: StudentAssignmentBuilder) {
        this.studentAssignmentBuilder = studentAssignmentBuilder;
        return this;
    }

    async build() {
        if (!this.studentAssignmentBuilder) throw new Error('Student Assignment Builder not defined')

        const studentAssignmentOutput = await this.studentAssignmentBuilder.build()
        const { studentId, assignmentId } = studentAssignmentOutput

        const response = await this.driver.post('/student-assignments/submit', {studentId: studentId, assignmentId: assignmentId})

        const submissionStatus = response.body.data.submitted

        return { studentId, assignmentId, submissionStatus }

    }
}