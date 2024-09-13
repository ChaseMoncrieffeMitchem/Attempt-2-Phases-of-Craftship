import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { assignmentService } from "../services/assignmentService";
import { AssignStudentDTO, CreateAssignmentDTO, GradeAssignmentDTO, SubmitAssignmentDTO } from "../dtos/assignmentDTO";

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
            const dto = CreateAssignmentDTO.formRequest(req.body)
            const assignment = await this.assignmentService.createAssignment(dto)
        
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
            const dto = AssignStudentDTO.formRequest(req.body)
            const studentAssignment = await this.assignmentService.assignStudent(dto)
        
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
            const dto = SubmitAssignmentDTO.formRequest(req.body)
            const studentAssignmentUpdated = await this.assignmentService.submitAssignment(dto)
    
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
            const dto = GradeAssignmentDTO.formRequest(req.body)

            // // validate grade
            // if (!['A', 'B', 'C', 'D'].includes(grade)) {
            //     return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            // }
            
            const studentAssignmentUpdated = await this.assignmentService.gradeAssignment(dto)
        
            res.status(200).json({ error: undefined, data: parseForResponse(studentAssignmentUpdated), success: true });
        } catch (error) {
            next(error)
        }
    }
}

export {assignmentsController}