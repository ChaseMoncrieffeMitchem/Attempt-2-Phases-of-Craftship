import express, { Request, Response } from 'express';
import { Database } from '../../shared/persistence/database';

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

export class AssignmentController {

    constructor(private database: Database) {

    }

    async createAssignment(req: Request, res: Response) {
        try {
            let dbConnection = await this.database.getConnection(); // Get the database connection
            if (isMissingKeys(req.body, ['classId', 'title'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }

            const { classId, title } = req.body;

            const assignment = await dbConnection.assignment.create({
                data: {
                    classId,
                    title
                }
            });

            res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
        } catch (error) {
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async mergeStudentAssignmentWithSubmissionStatus(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ['assignmentId', 'studentId'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }

            const { studentId, assignmentId } = req.body;

            const dbConnection = await this.database.getConnection(); // Get the database connection
            
            // Check if student assignment exists
            const studentAssignment = await dbConnection.studentAssignment.findUnique({
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

            const studentAssignmentUpdated = await dbConnection.studentAssignment.update({
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
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async mergeSubmittedAssignmentWithGrade(req: Request, res: Response) {
        try {
            if (isMissingKeys(req.body, ['studentId', 'assignmentId', 'grade'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
    
            const { assignmentId, studentId, grade } = req.body;
    
            // Validate grade
            if (!['A', 'B', 'C', 'D'].includes(grade)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
            
            const dbConnection = await this.database.getConnection(); // Get the database connection
            
            // Check if student assignment exists
            const studentAssignment = await dbConnection.studentAssignment.findUnique({
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
    
            const studentAssignmentUpdated = await dbConnection.studentAssignment.update({
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
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    async getAssignmentById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
            
            const dbConnection = await this.database.getConnection(); // Get the database connection
            
            const assignment = await dbConnection.assignment.findUnique({
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
            console.log(error); // Optional: Log the error for debugging
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    
}