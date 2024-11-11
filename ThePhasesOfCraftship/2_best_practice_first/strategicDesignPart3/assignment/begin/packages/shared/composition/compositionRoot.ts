import { WebServer } from "@dddforum/shared/http/webServer";
import { Database } from "@dddforum/backend/src/persistance/database";
import { UserController } from "@dddforum/backend/src/controllers/userController";
import { PostController } from "@dddforum/backend/src/controllers/postController";
import { MarketingController } from "@dddforum/backend/src/controllers/marketingController";
import { PrismaClient } from "@prisma/client";
import { ErrorExceptionHandler } from "@dddforum/shared/errorsAndExceptions/errorExceptionHandler";
import { UserServices } from "@dddforum/backend/src/services/userService";
import { Config } from "shared/config/config";
import { PostService } from "backend/src/services/postService";
import { MarketingService } from "backend/src/services/marketingService";

export class CompositionRoot {
  private static instance: CompositionRoot | null = null;

  private webServer: WebServer;
  private dbConnection: Database;
  private config: Config;
  private errorHandler: ErrorExceptionHandler;
  private usersService: UserServices;
  private postService: PostService;
  private marketingService: MarketingService;

  public static createCompositionRoot(config: Config) {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new this(config);
    }
    return CompositionRoot.instance;
  }

  private constructor(config: Config) {
    this.config = config;
    this.errorHandler = new ErrorExceptionHandler();
    this.dbConnection = this.createDBConnection();
    this.usersService = this.createUserService();
    this.postService = this.createPostService();
    this.marketingService = this.createMarketingService();
    this.webServer = this.createWebServer();
  }

  private createUserService() {
    const dbConnection = this.getDBConnection();
    return new UserServices(dbConnection);
  }

  private createPostService() {
    const dbConnection = this.getDBConnection();
    return new PostService(dbConnection)
  }

  private createMarketingService() {
    const dbConnection = this.getDBConnection()
    return new MarketingService(dbConnection)
  }

  private getUserService() {
    return this.usersService;
  }

  private getPostService() {
    return this.postService;
  }

  private getMarketingService() {
    return this.marketingService;
  }

  private getErrorHandler() {
    return this.errorHandler;
  }

  private createControllers() {
    const usersService = this.getUserService();
    const postService = this.getPostService();
    const marketingService = this.getMarketingService()
    const errorHandler = this.getErrorHandler();
    const userController = new UserController(usersService, errorHandler);
    const postController = new PostController(postService, errorHandler);
    const marketingController = new MarketingController(marketingService, errorHandler)

    return {
      userController,
      postController,
      marketingController
    };
  }

  private createDBConnection() {
    const dbConnection = new Database();
    if (!this.dbConnection) {
      this.dbConnection = dbConnection;
    }
    return dbConnection;
  }

  getDBConnection() {
    if (!this.dbConnection) this.createDBConnection();
    return this.dbConnection;
  }

  private createWebServer() {
    const controllers = this.createControllers();
    return new WebServer({ port: 3000, env: this.config.env }, controllers);
  }

  public getWebServer() {
    return this.webServer;
  }
}
