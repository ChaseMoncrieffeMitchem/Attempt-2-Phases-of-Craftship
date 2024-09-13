import { prisma } from "../database"
import { Database } from "../database";
import { StudentNotFoundException } from "../shared/exceptions";
import { CreateStudentDTO, StudentId } from "../dtos/studentDTO";

class studentsServices {
    constructor(private db: Database) {}

    async createStudent(dto: CreateStudentDTO) {
        const name = dto.name
        const response = await this.db.students.save(name)

        return response
    }

    async getAllStudents() {
        const response = await this.db.students.getAll()

        return response
        
    }

    async getStudentById (dto: StudentId) {
        const { id } = dto
        const response = await this.db.students.getById(id)

        if (!response) {
            throw new StudentNotFoundException
        }

        return response
    }

    async getAssignments (dto: StudentId) {
        const { id } = dto
        const studentExists = !!(await this.db.students.getById(id))

        if (!studentExists) {
            throw new StudentNotFoundException
        }

        const response = await this.db.students.getAssignments(id)

        return response
        
    }

    async getGrades (dto: StudentId) {
        const { id } = dto
        const studentExists = !!(await this.db.students.getById(id))

        if (!studentExists) {
            throw new StudentNotFoundException
        }

        const response = await this.db.students.getGrades(id)

        return response
    }
}

export {studentsServices}