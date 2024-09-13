import { Database, prisma } from "../database";
import { AssignStudentDTO, CreateAssignmentDTO, GradeAssignmentDTO, SubmitAssignmentDTO } from "../dtos/assignmentDTO";
import { AssignmentDoesNotExist, StudentNotFoundException } from "../shared/exceptions";

class assignmentService {
    constructor(private db: Database) {}

    async createAssignment(dto: CreateAssignmentDTO) {
        const { classId, title } = dto
        const response = await this.db.assignments.save(classId, title)
        return response
    }

    async assignStudent (dto: AssignStudentDTO) {
        const { studentId, assignmentId } = dto
        const studentExist = await this.db.students.getById(studentId)

        if (!studentExist) {
            throw new StudentNotFoundException
        }

        const assignmentExists = await this.db.assignments.getById(assignmentId)

        if (!assignmentExists) {
            throw new AssignmentDoesNotExist
        }
        
        const response = await this.db.assignments.getAssignment(studentId, assignmentId)
        
        return response
    }

    async submitAssignment (dto: SubmitAssignmentDTO) {
        const { studentId, assignmentId } = dto

        const assignmentExists = await this.db.assignments.getAssignment(studentId, assignmentId)

        if (!assignmentExists) {
            throw new AssignmentDoesNotExist
        }

        const response = await this.db.assignments.submit(assignmentExists.id)

        return response
        
    }

    async gradeAssignment (dto: GradeAssignmentDTO) {
        const { grade, studentId, assignmentId } = dto
        const assignmentExists = await this.db.assignments.getAssignment(studentId, assignmentId)

        if (!assignmentExists) {
            throw new AssignmentDoesNotExist
        }

        const response = await this.db.assignments.getGrade(assignmentExists.id, grade)

        return response
        
    }
}

export {assignmentService}