import Server from "./server";
import { Database } from "../database";
import { assignmentsController, studentsController, classesController } from "../controllers";
import { assignmentService } from "../services/assignmentService";
import { classServices } from "../services/classServices";
import { studentsServices } from "../services/studentsServices";
import { errorHandler } from "./errors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const db = new Database(prisma);

const studentsService = new studentsServices(db);
const classesService = new classServices(db);
const assignmentsService = new assignmentService(db);

const studentsControllers = new studentsController(
  studentsService,
  errorHandler
);
const classesControllers = new classesController(classesService, errorHandler);
const assignmentsControllers = new assignmentsController(
  assignmentsService,
  errorHandler
);
const server = new Server(
  studentsControllers,
  classesControllers,
  assignmentsControllers
);

export default server;