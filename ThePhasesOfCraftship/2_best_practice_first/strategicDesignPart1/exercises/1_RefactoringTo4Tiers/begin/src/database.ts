import { Prisma, PrismaClient } from '@prisma/client';

interface StudentPersistence {
    save(name: string): any;
    getAll(): any;
    getById(id:string): any;
    getAssignments(id: string): any;
    getGrades(id: string): any
}

interface ClassesPersistence {
    save(name: string): any;
    getById(id: string): any;
    enroll(studentId: string, classId: string): any;
}

class Database {
    public students: StudentPersistence;
    public classes: ClassesPersistence;

    constructor(private prisma: PrismaClient) {
        this.students = this.buildStudentPersistence();
        this.classes = this.buildClassesPersistence();
    }

    private buildStudentPersistence(): StudentPersistence {
        return {
            save: this.saveStudent,
            getAll: this.getAllStudents,
            getById: this.getStudentById,
            getAssignments: this.getAssignments,
            getGrades: this.getStudentGrades,
        }
    }

    private buildClassesPersistence(): ClassesPersistence {
        return {
            save: this.saveClass,
            getById: this.getClassById,
            enroll: this.getEnrollment,
        }
    }

    private async saveStudent(name: string) {
        const data = await this.prisma.student.create({data: {name}})

        return data
    }

    private async getAllStudents() {
        const data = await prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return data
    }

    private async getStudentById(id: string) {
        const data = await prisma.student.findUnique({
            where: {
                id
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        })

        return data
    }

    private async getAssignments (id: string) {
        const data = await prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted'
            },
            include: {
                assignment: true
            },
        });

        return data
    }

    private async getStudentGrades (id: string) {
        const data = await prisma.studentAssignment.findMany({
            where: {
                studentId: id,
            },
            include: {
                assignment: true
            },
        });

        return data
    }

    private async saveClass(name: string) {
        const data = await prisma.class.create({
            data: {
                name
            }
        });

        return data
    }

    private async getClassById(id: string) {
        const data = await this.prisma.class.findUnique({
            where: {
              id,
            },
          });
      
          return data;
    }

    private async getEnrollment(studentId: string, classId: string) {
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        const cls = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId
            }
        });

        const classEnrollment = await prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });

        return {student, cls, duplicatedClassEnrollment, classEnrollment}
    }
}


const prisma = new PrismaClient();
export { prisma , Database}