import { AssignmentController } from "../../modules/controllers/assignmentController";
import { ClassController } from "../../modules/controllers/classController";
import { StudentController } from "../../modules/controllers/studentController";
import { WebServer } from "../http/webServer";
import { Database } from "../persistence/database";

const database = new Database() 
const studentController = new StudentController(database)
const assignmentController = new AssignmentController(database)
const classController = new ClassController(database)

const webServer = new WebServer(studentController, classController, assignmentController)