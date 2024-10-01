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

export class WebServer {
  private express: express.Express;
  private http: Server | undefined

  constructor() {
    this.express = this.createExpress();
    this.configureExpress();
    this.setupRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  public setupRoutes() {
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

  public start() {
    // kill any processes running on the port

    // start the server
    let port = process.env.PORT || 3000;

    // save the http object
    this.http = this.express.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  }

  public stop() {}

  public getHttp() {
    return this.http
  }
}

