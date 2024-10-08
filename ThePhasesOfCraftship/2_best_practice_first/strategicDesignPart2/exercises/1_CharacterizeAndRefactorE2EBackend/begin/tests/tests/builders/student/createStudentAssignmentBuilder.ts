import { createStudentAssignmentDTO } from "../../../../src/shared/dtos/student/createStudentAssignmentDTO";

export class StudentAssignmentBuilder {
    private studentAssignmentInput: createStudentAssignmentDTO
    private classId: string = ''
    private assignmentId: string = ''

    constructor() {
        this.studentAssignmentInput = {
            studentId: '',
            assignmentId: ''
        }
    }

    withAssignmentId(value: string) {
        this.studentAssignmentInput.assignmentId = value
        return this
    }

    withStudentId(value: string) {
        this.studentAssignmentInput.studentId = value
        return this
    }

    build(): createStudentAssignmentDTO {
        return {
            assignmentId: this.studentAssignmentInput.assignmentId,
            studentId: this.studentAssignmentInput.studentId
        }
    }
}