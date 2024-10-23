import { WebServer } from "@dddforum/shared/http/webServer";
import { Database } from "@dddforum/shared/persistance/database";

const database = new Database() 
const studentController = new StudentController(database)
const assignmentController = new AssignmentController(database)
const classController = new ClassController(database)

const webServer = new WebServer(studentController, classController, assignmentController)

export class CompositionRoot {

    private database: Database;
    private studentController: StudentController;
    private classController: ClassController;
    private assignmentController: AssignmentController
    private webServer: WebServer

    constructor() {
        this.database = this.createDatabase()
        this.studentController = this.createStudentController()
        this.classController = this.createClassController()
        this.assignmentController = this.createAssignmentController()
        this.webServer = this.createWebServer()
    }

    private createDatabase() {
        return new Database()
    }

    private getDatabase() {
        return this.database
    }

    private createStudentController() {
        let database = this.getDatabase()
        return new StudentController(database)
    }

    private createClassController() {
        let database = this.getDatabase()
        return new ClassController(database)
    }

    private createAssignmentController() {
        let database = this.getDatabase()
        return new AssignmentController(database)
    }

    private createWebServer() {
        let studentController = this.createStudentController()
        let assignmentController = this.createAssignmentController()
        let classController = this.createClassController()
        return new WebServer(studentController, classController, assignmentController)
    }

    public getWebServer() {
        return this.webServer
    }
}