import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { studentsServices } from "../services/studentsServices";

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

class studentsController {
    private router: express.Router;

    constructor(
        private studentService: studentsServices,
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
        this.router.post("/", this.createStudent)
        this.router.get("/", this.getAllStudents)
        this.router.get("/:id", this.getStudentById)
        this.router.get("/:id/assignments", this.getAssignments)
        this.router.get("/:id/grades", this.getGrades)
    }

    private async createStudent(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            if (isMissingKeys(req.body, ["name"])) {
                return res.status(400).json({
                    error: Errors.ValidationError,
                    data: undefined,
                    success: false,
                })
            }

            const { name } = req.body

            const response = await this.studentService.createStudent(name)

            res.status(201).json({
                error: undefined,
                data: parseForResponse(response),
                success: true
            })
        } catch (error) {
            next(error)
        }
    }

    private async getAllStudents (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const response = this.studentService.getAllStudents()
            res.status(200).json({ error: undefined, data: parseForResponse(response), success: true})
        } catch (error) {
            res.status(500).json({ error: Errors.ServerError, data: undefined, success: false})
        }
    }

    private async getStudentById (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const { id } = req.params
            if(!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false})
            }
            const response = await this.studentService.getStudentById(id)

            if (!response) {
                return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false})
            }

            res.status(200).json({ error: undefined, data: parseForResponse(response), success: true})

        } catch (error) {
            next(error)
        }
    }

    private async getAssignments(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const { id } = req.params
            if (!isUUID(id)) {
                return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
            }
            const response = await this.studentService.getAssignments(id)

            // if (!response) {
            //     return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
            // }

            // const studentAssignments = await this.studentService.getAssignments(id)

            res.status(200).json({ error: undefined, data: parseForResponse(response), success: true})
    
        } catch(error) {
            next(error)
        }
    }

    private async getGrades (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try{
            const { id } = req.params;
        if(!isUUID(id)) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        }
        const student = await this.studentService.getGrades(id)
        if (!student) {
            return res.status(404).json({ error: Errors.StudentNotFound, data: undefined, success: false });
        };
        const studentAssignments = await this.studentService.getGrades(id);
        
        res.status(200).json({ error: undefined, data: parseForResponse(studentAssignments), success: true });
        } catch (error) {
            next(error)
        }
    }

}

export {studentsController}