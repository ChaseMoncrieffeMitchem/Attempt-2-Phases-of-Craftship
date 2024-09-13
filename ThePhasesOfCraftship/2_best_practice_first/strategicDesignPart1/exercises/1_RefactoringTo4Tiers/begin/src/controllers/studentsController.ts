import Errors from "../shared/constants";
import { ErrorHandler } from "../shared/errors"
import express from "express"
import { prisma } from "../database"
import { studentsServices } from "../services/studentsServices";
import { CreateStudentDTO, StudentId } from "../dtos/studentDTO";
import { parseForResponse } from "../shared/utils";


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
            const dto = CreateStudentDTO.formRequest(req.body)
            const response = await this.studentService.createStudent(dto)

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
            next(error)
        }
    }

    private async getStudentById (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const dto = StudentId.formRequestParams(req.params)
            
            const response = await this.studentService.getStudentById(dto)

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
            const dto = StudentId.formRequestParams(req.params)
            const response = await this.studentService.getAssignments(dto)

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
            const dto = StudentId.formRequestParams(req.body)
            const student = await this.studentService.getGrades(dto)
            
            res.status(200).json({ error: undefined, data: parseForResponse(student), success: true });
            } catch (error) {
                next(error)
            }
    }

}

export {studentsController}