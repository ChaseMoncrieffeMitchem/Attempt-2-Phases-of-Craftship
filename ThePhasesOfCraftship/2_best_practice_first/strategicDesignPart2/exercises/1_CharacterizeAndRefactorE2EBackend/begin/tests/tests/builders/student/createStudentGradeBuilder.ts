import { createStudentGradeDTO } from "../../../../src/shared/dtos/student/createStudentGradeDTO"
import { RESTfulAPIDriver } from "../../../../src/shared/http/apiDriver";
import { SubmitAssignmentBuilder } from "../assignment/submitAssignment";
import { StudentAssignmentBuilder } from "./createStudentAssignmentBuilder";

function getRandomGrade(): string {
    const grades = ['A', 'B', 'C', 'D'];
    return grades[Math.floor(Math.random() * grades.length)];
}

export class StudentGradeBuilder {
    private grade: string = ''
    private name: string = ''
    private email: string = ''
    private studentId: string = ''
    private driver: RESTfulAPIDriver
    private submitAssignmentBuilder?: SubmitAssignmentBuilder;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    // withAssignmentId (value: string) {
    //     this.studentGradeInput.assignmentId = value
    //     return this
    // }

    // withStudentId (value: string) {
    //     this.studentGradeInput.studentId = value
    //     return this
    // }

    from (submitAssignmentBuilder: SubmitAssignmentBuilder) {
        this.submitAssignmentBuilder = submitAssignmentBuilder
        return this
    }

    withGrade () {
    this.grade = getRandomGrade()
        return this
    }

    async build() {
        if (!this.submitAssignmentBuilder) throw new Error("Student Assignment Builder is not defined")

        const submitAssignmentBuilderOutput = await this.submitAssignmentBuilder.build()

        const { studentId, assignmentId } = submitAssignmentBuilderOutput

        const response = await this.driver.post('/student-assignments/grade', {studentId: studentId, assignmentId: assignmentId, grade: this.grade } )

        const grade = response.body.data.grade

        return { grade, studentId, assignmentId }
    }
}