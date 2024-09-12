import { Database, prisma } from "../database";
import { ClassNotFoundException, StudentAlreadyEnrolledException, StudentNotFoundException } from "../shared/exceptions";

class classServices {
    constructor(private db: Database) {}

    async createClass (name: string) {
        const response = await this.db.classes.save(name)

        return response
    }

    async enrollStudent (studentId: string, classId: string) {
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

    async getAssignments (classId: string, title: string) {
        const assignment = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
        return assignment
    }
}

export {classServices}