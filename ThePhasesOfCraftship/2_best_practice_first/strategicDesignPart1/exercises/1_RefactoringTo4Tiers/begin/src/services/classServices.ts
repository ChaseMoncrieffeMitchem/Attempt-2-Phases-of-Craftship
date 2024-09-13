import { Database, prisma } from "../database";
import { ClassId, CreateClassDTO, EnrollStudentDTO } from "../dtos/classDTO";
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "../shared/exceptions";

class classServices {
    constructor(private db: Database) {}

    async createClass (dto: CreateClassDTO) {
        const { name } = dto
        const response = await this.db.classes.save(name)

        return response
    }

    async enrollStudent (dto: EnrollStudentDTO) {
        const { studentId, classId } = dto
        const student = await this.db.students.getById(studentId);

        if (!student) {
            throw new StudentNotFoundException;
        }

        const cls = await this.db.classes.getById(classId);

        if (!cls) {
            throw new ClassNotFoundException(classId);
        }

        const isStudentEnroled = !!(await this.db.classes.enroll(
            classId, studentId
        ))

        if (isStudentEnroled) {
            throw new StudentAlreadyEnrolledException;
        }
      
        const response = await this.db.classes.enroll(studentId, classId)

        return response
        
    }

    async getAssignments (classId: ClassId) {
        const { id } = classId
        const cls = await this.db.classes.getById(id)

        if (!cls) {
            throw new ClassNotFoundException(id)
        }

        const response = await this.db.classes.getAssignment(id)
        return response
    }
}

export {classServices}