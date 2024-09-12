import { prisma } from "../database"
import { Database } from "../database";
import { StudentNotFoundException } from "../shared/exceptions";

class studentsServices {
    constructor(private db: Database) {}

    async createStudent(name: string) {
        const response = await this.db.students.save(name)

        return response
    }

    async getAllStudents() {
        const response = await this.db.students.getAll()

        return response
        
    }

    async getStudentById (id: string) {
        const response = await this.db.students.getById(id)

        return response
    }

    async getAssignments (id: string) {
        const studentExists = !!(await this.db.students.getById(id))

        if (!studentExists) {
            throw new StudentNotFoundException
        }

        const response = await this.db.students.getAssignments(id)

        return response
        
    }

    async getGrades (id: string) {
        const studentExists = !!(await this.db.students.getById(id))

        if (!studentExists) {
            throw new StudentNotFoundException
        }
        
        const response = await this.db.students.getGrades(id)

        return response
    }
}

export {studentsServices}