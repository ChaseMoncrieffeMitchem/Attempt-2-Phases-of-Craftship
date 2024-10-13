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
    private assignmentId: string = ''
    private driver: RESTfulAPIDriver
    private submitAssignmentBuilder?: SubmitAssignmentBuilder;

    constructor(driver: RESTfulAPIDriver) {
        this.driver = driver
    }

    withAssignmentId (value: string) {
        this.assignmentId = value
        return this
    }

    withStudentId (value: string) {
        this.studentId = value
        return this
    }

    withGrade () {
    this.grade = getRandomGrade()
        return this
    }

    async build() {
        if (!this.studentId) throw new Error("StudentID not defined")
        if (!this.assignmentId) throw new Error("AssignmentID not defined")

        const response = await this.driver.post('/student-assignments/grade', {studentId: this.studentId, assignmentId: this.assignmentId, grade: this.grade } )

        const { studentId, assignmentId, grade } = response.body?.data

        return { grade, studentId, assignmentId }
    }
}