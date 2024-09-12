import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { classServices } from "../services/classServices";

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

class classesController {
    private router: express.Router;

    constructor(
        private classService: classServices,
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
        this.router.post("/", this.createClass);
        this.router.post("/enrollments", this.enrollStudent);
        this.router.get("/:id/assignments", this.getAssignments);
    }

    private async createClass (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['name'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { name } = req.body;
        
            const cls = await this.classService.createClass(name)
        
            res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
        } catch (error) {
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    private async enrollStudent (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['studentId', 'classId'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { studentId, classId } = req.body;
        
            // check if student exists
            const student = await this.classService.enrollStudent(studentId, classId);
        
            if (!student) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            }
        
            // check if class exists
            const cls = await this.classService.enrollStudent(studentId, classId);
    
            // check if student is already enrolled in class
            const duplicatedClassEnrollment = await this.classService.enrollStudent(studentId, classId)
    
            if (duplicatedClassEnrollment) {
                return res.status(400).json({ error: Errors.StudentAlreadyEnrolled, data: undefined, success: false });
            }
        
            if (!cls) {
                return res.status(404).json({ error: Errors.ClassNotFound, data: undefined, success: false });
            }
        
            const classEnrollment = await this.classService.enrollStudent(studentId, classId)
        
            res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
        } catch (error) {
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }

    private async getAssignments (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ['classId', 'title'])) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
        
            const { classId, title } = req.body;
        
            const assignment = await this.classService.getAssignments(classId, title)
        
            res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
        } catch (error) {
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }
}

export {classesController}