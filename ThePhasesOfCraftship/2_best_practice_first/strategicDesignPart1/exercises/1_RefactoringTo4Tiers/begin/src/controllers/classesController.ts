import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { classServices } from "../services/classServices";
import { ClassId, CreateClassDTO, EnrollStudentDTO } from "../dtos/classDTO";
import { parseForResponse } from "../shared/utils";

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
            const dto = CreateClassDTO.formRequest(req.body)
            const cls = await this.classService.createClass(dto)
        
            res.status(201).json({ error: undefined, data: parseForResponse(cls), success: true });
        } catch (error) {
            next(error)
        }
    }

    private async enrollStudent (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const dto = EnrollStudentDTO.formRequest(req.body)
            const classEnrollment = await this.classService.enrollStudent(dto)
        
            res.status(201).json({ error: undefined, data: parseForResponse(classEnrollment), success: true });
        } catch (error) {
            next(error)
        }
    }

    private async getAssignments (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const dto = ClassId.formRequestParams(req.params)
            const assignment = await this.classService.getAssignments(dto)
        
            res.status(201).json({ error: undefined, data: parseForResponse(assignment), success: true });
        } catch (error) {
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
    }
}

export {classesController}