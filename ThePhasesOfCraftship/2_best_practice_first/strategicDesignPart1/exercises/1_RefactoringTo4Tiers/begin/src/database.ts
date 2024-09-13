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
    getAssignment(classId: string): any;
}

interface AssignmentPersistence {
    save(classId: string, title: string): any;
    getById(id: string): any;
    getAssignment(studentId: string, assignmentId: string): any;
    submit(id: string): any;
    getGrade(id: any, grade: string): any;
}

class Database {
    public students: StudentPersistence;
    public classes: ClassesPersistence;
    public assignments: AssignmentPersistence

    constructor(private prisma: PrismaClient) {
        this.students = this.buildStudentPersistence();
        this.classes = this.buildClassesPersistence();
        this.assignments = this.buildAssignmentPersistence()
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
            getAssignment: this.getClassAssignments,
        }
    }

    private buildAssignmentPersistence(): AssignmentPersistence {
        return {
            save: this.saveAssignment,
            getById: this.getAssignmentById,
            getAssignment: this.studentAssignment,
            submit: this.submitAssignment,
            getGrade: this.gradeAssignment,
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
        const data = await prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });

        return data
    }

    private async getClassAssignments(classId: string) {
        const assignment = await prisma.assignment.create({
            data: {
                classId: classId
            },
            include: {
                class: true,
                studentTasks: true
            }
        });
        return assignment
    }

    private async saveAssignment(classId: string, title: string) {
        const data = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
        return data
    }

    private async getAssignmentById (id: string) {
        const data = await prisma.assignment.findUnique({
            where: {
                id,
            }
        });

        return data
    }

    private async studentAssignment(studentId: string, assignmentId: string) {
        
        const data = await prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });

        return data
    }

    private async submitAssignment(id: string) {
        const data = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status: 'submitted'
            }
        });

        return data
    }

    private async gradeAssignment(id: string, grade: string) {

        const data = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade,
            }
        });

        return data
    }
}


const prisma = new PrismaClient();
export { prisma , Database}