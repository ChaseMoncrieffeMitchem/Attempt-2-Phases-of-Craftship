import { prisma } from "../database";

class assignmentService {

    async createAssignment(classId: string, title: string) {
        const assignment = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
        return assignment
    }

    async assignStudent (studentId: string, assignmentId: string) {
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignmentId
            }
        });

        const studentAssignment = await prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });

        return {student, assignment, studentAssignment}
    }

    async submitAssignment (id: string) {
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });

        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                status: 'submitted'
            }
        });

        return {studentAssignment, studentAssignmentUpdated}
    }

    async gradeAssignment (id: string, grade: string) {
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                id
            }
        });

        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                id
            },
            data: {
                grade,
            }
        });

        return {studentAssignment, studentAssignmentUpdated}
    }
}

export {assignmentService}