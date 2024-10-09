import { createStudentGradeDTO } from "../../../../src/shared/dtos/student/createStudentGradeDTO"

function getRandomGrade(): string {
    const grades = ['A', 'B', 'C', 'D'];
    return grades[Math.floor(Math.random() * grades.length)];
}

export class StudentGradeBuilder {
    private studentGradeInput: createStudentGradeDTO
    private name: string = ''
    private email: string = ''
    private studentId: string = ''

    constructor() {
        this.studentGradeInput = {
            assignmentId: '',
            grade: '',
            studentId: ''
        }
    }

    withAssignmentId (value: string) {
        this.studentGradeInput.assignmentId = value
        return this
    }

    withStudentId (value: string) {
        this.studentGradeInput.studentId = value
        return this
    }

    withGrade () {
    this.studentGradeInput.grade = getRandomGrade()
        return this
    }

    build(): createStudentGradeDTO {
        return {
            assignmentId: this.studentGradeInput.assignmentId,
            grade: this.studentGradeInput.grade,
            studentId: this.studentGradeInput.studentId
        }
    }
}