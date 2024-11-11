import express from "express";
import cors from "cors";
import { Server } from "http";
import { 
  ProcessService 
} from "@dddforum/shared/processes/processServer";
import { UserController } from "backend/src/controllers/userController";
import { PostController } from "backend/src/controllers/postController";
import { MarketingController } from "backend/src/controllers/marketingController";

interface WebServerConfig {
  port: number;
  env: string;
}

export class WebServer {
  private express: express.Express;
  private state: "stopped" | "started";
  private instance: Server | undefined;
  private userController: UserController;
  private postController: PostController;
  private marketingController: MarketingController;

  constructor(private config: WebServerConfig, controllers: { 
    userController: UserController; 
    postController: PostController; 
    marketingController: MarketingController 
  }) {
    this.state = "stopped";
    this.express = express();
    this.userController = controllers.userController;
    this.postController = controllers.postController;
    this.marketingController = controllers.marketingController;
    this.initializeServer();
  }

  private initializeServer() {
    this.addMiddlewares();
    this.express.use(cors());
  }

  private addMiddlewares() {
    this.express.use(express.json());
  }

  public mountRouter(path: string, router: express.Router) {
    this.express.use(path, router);
  }

  public getApplication() {
    return this.express;
  }

  public setupRoutes() {

    this.express.get('/health', (req, res) => {
        return res.send({ ok: true }).status(200)
    })

    // Use the user controller's router for user-related routes
    this.express.use('/users', this.userController.getRouter());

    this.express.get('/posts', this.postController.getRouter());

    this.express.get('/marketing', this.marketingController.getRouter());

  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        if (this.config.env === " test") {
          resolve();
        }
        console.log("Starting the server");
        this.instance = this.express.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.state = "started";
          resolve();
        });
      });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (!this.instance) return reject("Server not started");
      this.instance.close((err) => {
        if (err) return reject("Error stopping the server");
        this.state = "stopped";
        return resolve("Server stopped");
      });
    });
  }

  isStarted() {
    return this.state === "started";
  }
}