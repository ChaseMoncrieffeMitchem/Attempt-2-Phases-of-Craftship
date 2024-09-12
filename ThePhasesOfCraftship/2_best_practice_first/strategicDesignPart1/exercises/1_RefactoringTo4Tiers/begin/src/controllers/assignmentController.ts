import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { assignmentService } from "../services/assignmentService";

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

class assignmentsController {
    private router: express.Router;

    constructor(
        private assignmentService: assignmentService,
        private errorHandler: ErrorHandler
    ) {
        this.router = express.Router();
        this.setupRoutes();
        this.setupErrorHandler()
    }

    getRouter() {
        return this.router
    }

    private setupErrorHandler() {
        this.router.use(this.errorHandler)
    }

    private setupRoutes() {
        this.router.post("/", this.createAssignment)
        this.router.get("/:id", this.assignStudent)
        this.router.post("/submit", this.submitAssignment)
        this.router.post("/grade", this.gradeAssignment)
    }

    private async createAssignment (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['classId', 'title'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { classId, title } = req.body;
        
            const assignment = await this.assignmentService.createAssignment(classId, title)
        
            res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
        } catch (error) {
            next(error)
        }
    }

    private async assignStudent (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['studentId', 'assignmentId'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { studentId, assignmentId, grade } = req.body;
        
            // check if student exists
            const student = await this.assignmentService.assignStudent(studentId, assignmentId)
        
            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }
        
            // check if assignment exists
            const assignment = await this.assignmentService.assignStudent(studentId, assignmentId)
        
            if (!assignment) {
                return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
            }
        
            const studentAssignment = await this.assignmentService.assignStudent(studentId, assignmentId)
        
            res.status(201).json({ error: undefined, data: parseForResponse(studentAssignment), success: true });
        } catch (error) {
            next(error)
        }
    }

    private async submitAssignment (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['id'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
    
            const { id } = req.body;
            
            // check if student assignment exists
            const studentAssignment = await this.assignmentService.submitAssignment(id)
    
            if (!studentAssignment) {
                return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
            }
    
            const studentAssignmentUpdated = await this.assignmentService.submitAssignment(id)
    
            res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
        } catch (error) {
            next(error)
        }
    }

    private async gradeAssignment(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['id', 'grade'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { id, grade } = req.body;
        
            // validate grade
            if (!['A', 'B', 'C', 'D'].includes(grade)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
            
            // check if student assignment exists
            const studentAssignment = await this.assignmentService.gradeAssignment(id, grade)
            if (!studentAssignment) {
                return res.status(404).json({ error: Errors.AssignmentNotFound, data: undefined, success: false });
            }
        
            const studentAssignmentUpdated = await this.assignmentService.gradeAssignment(id, grade)
        
            res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
        } catch (error) {
            next(error)
        }
    }
}

export {assignmentsController}