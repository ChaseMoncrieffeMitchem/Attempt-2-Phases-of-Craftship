import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { StudentAssignmentBuilder } from "../student/createStudentAssignmentBuilder";

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
        console.log("Response from studentAssignmentBuilder:", studentAssignmentOutput);


        const { assignmentsAssignedToStudents } = studentAssignmentOutput
        const { studentId, assignmentId } = assignmentsAssignedToStudents
    }
}