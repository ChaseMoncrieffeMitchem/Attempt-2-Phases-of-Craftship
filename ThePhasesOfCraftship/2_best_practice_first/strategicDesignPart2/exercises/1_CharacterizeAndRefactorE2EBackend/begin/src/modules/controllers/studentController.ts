import express, { Request, Response } from 'express';
import { prisma } from '../../database';

const Errors = {
    ValidationError: 'ValidationError',
    StudentNotFound: 'StudentNotFound',
    ClassNotFound: 'ClassNotFound',
    AssignmentNotFound: 'AssignmentNotFound',
    ServerError: 'ServerError',
    ClientError: 'ClientError',
    StudentAlreadyEnrolled: 'StudentAlreadyEnrolled'
  }

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
}

function parseForResponse(data: unknown) {
    return JSON.parse(JSON.stringify(data));
}

function isUUID (id: string) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
}

// POST student created
export const createStudentController = async (req: Request, res: Response) => {
    try {
                
        if (isMissingKeys(req.body, ['name', 'email'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        const { name, email } = req.body;

        const student = await prisma.student.create({
            data: {
                name,
                email            
            }
        });

        res.status(201).json({ error: undefined, data: parseForResponse(student), success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}

// POST student assigned to class
export const classEnrollmentController = async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['studentId', 'classId'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { studentId, classId } = req.body;
    
        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });
    
        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }
    
        // check if class exists
        const cls = await prisma.class.findUnique({
            where: {
                id: classId
            }
        });

        // check if student is already enrolled in class
        const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
            where: {
                studentId,
                classId
            }
        });

        if (duplicatedClassEnrollment) {
            return res.status(400).json({ error: Errors.StudentAlreadyEnrolled, data: undefined, success: false });
        }
    
        if (!cls) {
            return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
        }
    
        const classEnrollment = await prisma.classEnrollment.create({
            data: {
                studentId,
                classId
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
 
}


// POST assignment created
export const createAssignmentController = async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['classId', 'title'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { classId, title } = req.body;
    
        const assignment = await prisma.assignment.create({
            data: {
                classId,
                title
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}



// POST student assigned to assignment
export const mergeStudentWithAssignmentController = async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { studentId, assignmentId, grade } = req.body;
    
        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });
    
        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }
    
        // check if assignment exists
        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignmentId
            }
        });
    
        if (!assignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        const studentAssignment = await prisma.studentAssignment.create({
            data: {
                studentId,
                assignmentId,
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }

}


// POST student submitted assignment
export const mergeStudentAssignmentWithSubmissionStatusController = async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['assignmentId', 'studentId'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { studentId, assignmentId } = req.body;
        
        // check if student assignment exists
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                studentId_assignmentId: {
                    assignmentId,
                    studentId
                }
            }
        });
    
        if (!studentAssignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                studentId_assignmentId: {
                    assignmentId,
                    studentId
                }
            },
            data: {
                status: 'submitted'
            }
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}

// POST create Class
export const createClassController = async (req: Request, res: Response) => {
    try {
        if (isMissingKeys(req.body, ['name'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { name } = req.body;
    
        const cls = await prisma.class.create({
            data: {
                name
            }
        });
    
        res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}

// Post merge assignment with grade
export const mergeSubmittedAssignmentWithGradeController = async (req: Request, res: Response) => {
    try {

        if (isMissingKeys(req.body, ['studentId', 'assignmentId', 'grade'])) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
    
        const { assignmentId, studentId, grade } = req.body;
    
        // validate grade
        if (!['A', 'B', 'C', 'D'].includes(grade)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        
        // check if student assignment exists
        const studentAssignment = await prisma.studentAssignment.findUnique({
            where: {
                studentId_assignmentId: {
                    assignmentId,
                    studentId
                }
            }
        });
    
        if (!studentAssignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        const studentAssignmentUpdated = await prisma.studentAssignment.update({
            where: {
                studentId_assignmentId: {
                    assignmentId,
                    studentId
                }
            },
            data: {
                grade,
            }
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET all students
export const getAllStudentsController = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }, 
            orderBy: {
                name: 'asc'
            }
        });
        res.status(200).json({ error: undefined, data: parseForResponse(students), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET a student by id
export const getStudentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        const student = await prisma.student.findUnique({
            where: {
                id
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true
            }
        });
    
        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }
    
        res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET assignment by id
export const getAssignmentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        const assignment = await prisma.assignment.findUnique({
            include: {
                class: true,
                studentTasks: true
            },
            where: {
                id
            }
        });
    
        if (!assignment) {
            return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
        }
    
        res.status(200).json({ error: undefined, data: parseForResponse(assignment), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET all assignments for class
export const findAllAssignmentsAllClassesController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        // check if class exists
        const cls = await prisma.class.findUnique({
            where: {
                id
            }
        });

        if (!cls) {
            return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                classId: id
            },
            include: {
                class: true,
                studentTasks: true
            }
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(assignments), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET all student submitted assignments
export const getAllSubmittedAssignmentsController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });

        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }

        const studentAssignments = await prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted'
            },
            include: {
                assignment: true
            },
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}


// GET all student grades
export const getAllGradesController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }

        // check if student exists
        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });

        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        }

        const studentAssignments = await prisma.studentAssignment.findMany({
            where: {
                studentId: id,
                status: 'submitted',
                grade: {
                    not: null
                }
            },
            include: {
                assignment: true
            },
        });
    
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
    } catch (error) {
        res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
    }
}