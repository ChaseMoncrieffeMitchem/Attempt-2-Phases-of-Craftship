   import { WebServer } from "@dddforum/shared/http/webServer"
   import { UserController } from "@/controllers/userController";
   import { PostController } from "@/controllers/postController";
   import { MarketingController } from "@/controllers/marketingController";
   import { userServices } from "@/services/userService";
   import { PostService } from "@/services/postService";
   import { MarketingService } from "@/services/marketingService";
   import { Database } from "@/persistance/database";
   import { ErrorExceptionHandler } from "@dddforum/shared/errorsAndExceptions/errorExceptionHandler";
   import { Config } from "../config/config";
import { PrismaClient } from "@prisma/client";
   
   export class CompositionRoot {
     private static instance: CompositionRoot | null = null;
     
     private webServer: WebServer;
     private dbConnection: Database;
     private config: Config;
     private errorHandler: ErrorExceptionHandler;
     private usersService: userServices;
     private postsService: PostService;
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
       this.postsService = this.createPostService();
       this.marketingService = this.createMarketingService();
       this.webServer = this.createWebServer();
     }
   
     private getUsersService() {
       return this.usersService;
     }

     private getPostsService() {
       return this.postsService;
     }

     private getMarketingService() {
        return this.marketingService
     }
   
     private getErrorHandler() {
       return this.errorHandler;
     }
   
     private createUserService() {
       const dbConnection = this.getDBConnection();
       return new userServices(dbConnection);
     }

     private createPostService() {
       const dbConnection = this.getDBConnection();
       return new PostService(dbConnection);
     }

     private createMarketingService() {
        const dbConnection = this.getDBConnection();
        return new MarketingService(dbConnection)
     }
   
     private createControllers() {
       const errorHandler = this.getErrorHandler();
       const usersService = this.getUsersService();
       const postsService = this.getPostsService();
       const marketingService = this.getMarketingService()

       const usersController = new UserController(usersService, errorHandler);
       const postsController = new PostController(postsService, errorHandler);
       const marketingController = new MarketingController(marketingService, errorHandler);
   
       return {
         usersController,
         postsController,
         marketingController
       };
     }
   
     private createDBConnection() {
        const prisma = new PrismaClient()
       const dbConnection = new Database(prisma);
       if (!this.dbConnection) {
         this.dbConnection = dbConnection;
       }
       return dbConnection;
     }
   
     getDBConnection() {
       if (!this.dbConnection) this.createDBConnection();
       return this.dbConnection;
     }
   
     createWebServer() {
        const { usersController, postsController, marketingController } = this.createControllers();
        return new WebServer(usersController, postsController, marketingController);
      }
   
     getWebServer() {
       return this.webServer;
     }
   }