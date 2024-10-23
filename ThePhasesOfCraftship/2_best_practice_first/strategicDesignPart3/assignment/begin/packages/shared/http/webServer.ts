import express from "express";

import cors from "cors";
import { Server } from "http";
import { ProcessService } from "@dddforum/shared/processes/processServer";
import { UserController } from "@dddforum/backend/src/controllers/userController";
import { PostController } from "@dddforum/backend/src/controllers/postController";
import { MarketingController } from "@dddforum/backend/src/controllers/marketingController"

export class WebServer {
  private express: express.Express;
  private http: Server | undefined
  private state: 'Started' | 'Stopped'

  constructor(
    private userController: UserController, 
    private postController: PostController, 
    private marketingController: MarketingController
) 
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

    this.express.post('/users/new', (req, res) => this.userController.createUser(req, res) );

    this.express.get('/users', (req, res) => this.userController.getUserByEmail(req, res))

    this.express.get('/posts', (req, res) => this.postController.getPosts(req, res))

    this.express.post('/marketing/new', (req, res) => this.marketingController.addEmailToMarketingList(req, res))

    // this.express.post("/students", (req, res) => this.studentController.createStudent(req, res));
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

