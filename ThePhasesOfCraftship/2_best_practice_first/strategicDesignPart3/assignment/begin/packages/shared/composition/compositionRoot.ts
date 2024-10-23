import { WebServer } from "@dddforum/shared/http/webServer";
import { Database } from "@dddforum/shared/persistance/database";
import { UserController } from "@dddforum/backend/src/controllers/userController";
import { PostController } from "@dddforum/backend/src/controllers/postController";
import { MarketingController } from "@dddforum/backend/src/controllers/marketingController"

const database = new Database() 
const userController = new UserController(database)
const postController = new PostController(database)
const marketingController = new MarketingController(database)

const webServer = new WebServer(userController, postController, marketingController)

export class CompositionRoot {

    private database: Database;
    private userController: UserController;
    private postController: PostController;
    private marketingController: MarketingController
    private webServer: WebServer

    constructor() {
        this.database = this.createDatabase()
        this.userController = this.createUserController()
        this.postController = this.createPostController()
        this.marketingController = this.createMarketingController()
        this.webServer = this.createWebServer()
    }

    private createDatabase() {
        return new Database()
    }

    private getDatabase() {
        return this.database
    }

    private createUserController() {
        let database = this.getDatabase()
        return new UserController(database)
    }

    private createPostController() {
        let database = this.getDatabase()
        return new PostController(database)
    }

    private createMarketingController() {
        let database = this.getDatabase()
        return new MarketingController(database)
    }

    private createWebServer() {
        let userController = this.createUserController()
        let postController = this.createPostController()
        let marketingController = this.createMarketingController()
        return new WebServer(userController, postController, marketingController)
    }

    public getWebServer() {
        return this.webServer
    }
}