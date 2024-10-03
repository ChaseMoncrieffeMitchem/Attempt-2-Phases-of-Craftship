import express from "express";

import cors from "cors";
import { Server } from "http";
import { ProcessService } from "../processes/processServer";
import { StudentController } from "../../../src/modules/controllers/studentController"
import { ClassController } from "../../modules/controllers/classController";
import { AssignmentController } from "../../modules/controllers/assignmentController";

export class WebServer {
  private express: express.Express;
  private http: Server | undefined
  private state: 'Started' | 'Stopped'

  constructor(
    private studentController: StudentController, 
    private classController: ClassController, 
    private assignmentController: AssignmentController) 
    {
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

    this.express.post("/students", (req, res) => this.studentController.createStudent(req, res));

    this.express.post("/classes", (req, res) => this.classController.createClass(req, res));

    this.express.post("/class-enrollments", (req, res) => this.classController.mergeStudentWithClass(req, res));

    this.express.post("/assignments", (req, res) => this.assignmentController.createAssignment(req, res));

    this.express.post(
      "/student-assignments",
      (req, res) => this.studentController.mergeStudentWithAssignment(req, res));

    this.express.post(
      "/student-assignments/submit",
      (req, res) => this.assignmentController.mergeStudentAssignmentWithSubmissionStatus(req, res));

    this.express.post(
      "/student-assignments/grade",
      (req, res) => this.assignmentController.mergeSubmittedAssignmentWithGrade(req, res));

    this.express.get("/students", (req, res) => this.studentController.getAllStudents(req, res));

    this.express.get("/students/:id", (req, res) => this.studentController.getStudentById(req, res));

    this.express.get("/assignments/:id", (req, res) => this.assignmentController.getAssignmentById(req, res));

    this.express.get(
      "/classes/:id/assignments",
      (req, res) => this.classController.findAllAssignmentsForClass(req, res));

    this.express.get(
      "/student/:id/assignments",
      (req, res) => this.studentController.getAllSubmittedAssignments(req, res));

    this.express.get("/student/:id/grades", (req, res) => this.studentController.getAllGrades(req, res));
  }

  public async start(port: number = 3000): Promise<void> {
    // Kill the process running on the port if it's already running
    // let port = 3000;
    
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
        console.log("Server Successfully Stopped")
        resolve();
      });
    });
  }
  
  

  public getHttp() {
    if (!this.isStarted()) throw new Error('is not started yet')
    return this.http
  }
}

