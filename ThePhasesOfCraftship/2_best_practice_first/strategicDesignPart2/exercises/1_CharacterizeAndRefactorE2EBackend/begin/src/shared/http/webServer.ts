import express from "express";

import cors from "cors";
import {
  classEnrollmentController,
  createAssignmentController,
  createClassController,
  createStudentController,
  findAllAssignmentsAllClassesController,
  getAllGradesController,
  getAllStudentsController,
  getAllSubmittedAssignmentsController,
  getAssignmentByIdController,
  getStudentByIdController,
  mergeStudentAssignmentWithSubmissionStatusController,
  mergeStudentWithAssignmentController,
  mergeSubmittedAssignmentWithGradeController,
} from "../../modules/controllers/studentController";
import { Server } from "http";
import { ProcessService } from "../processes/processServer";

export class WebServer {
  private express: express.Express;
  private http: Server | undefined
  private state: 'Started' | 'Stopped'

  constructor() {
    this.express = this.createExpress();
    this.configureExpress();
    this.setupRoutes();
    this.state = 'Stopped'
  }

  private createExpress() {
    return express();
  }

  private configureExpress() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  public setupRoutes() {
    this.express.get('/health', (req, res) => {
        return res.send({ ok: true }).status(200)
    })
    this.express.post("/students", createStudentController);
    this.express.post("/classes", createClassController);
    this.express.post("/class-enrollments", classEnrollmentController);
    this.express.post("/assignments", createAssignmentController);
    this.express.post(
      "/student-assignments",
      mergeStudentWithAssignmentController
    );
    this.express.post(
      "/student-assignments/submit",
      mergeStudentAssignmentWithSubmissionStatusController
    );
    this.express.post(
      "/student-assignments/grade",
      mergeSubmittedAssignmentWithGradeController
    );
    this.express.get("/students", getAllStudentsController);
    this.express.get("/students/:id", getStudentByIdController);
    this.express.get("/assignments/:id", getAssignmentByIdController);
    this.express.get(
      "/classes/:id/assignments",
      findAllAssignmentsAllClassesController
    );
    this.express.get(
      "/student/:id/assignments",
      getAllSubmittedAssignmentsController
    );
    this.express.get("/student/:id/grades", getAllGradesController);
  }

  public async start(): Promise<void> {
    // Kill the process running on the port if it's already running
    let port = 3000;
    
    return new Promise(async (resolve, reject) => {
      await ProcessService.killProcessOnPort(port, () => {
        this.http = this.express.listen(port, () => {
          console.log(`Server is running on port ${port}`);
          this.state = 'Started';
          resolve();
        });
      });
    });
  }
  
  
  public isStarted () {
    return this.state === 'Started'
  }

  public async stop(): Promise<void> {
    if (!this.isStarted()) return;
  
    return new Promise((resolve, reject) => {
      this.http?.close(() => {
        this.state = 'Stopped';
        resolve();
      });
    });
  }
  
  

  public getHttp() {
    if (!this.isStarted()) throw new Error('is not started yet')
    return this.http
  }
}

