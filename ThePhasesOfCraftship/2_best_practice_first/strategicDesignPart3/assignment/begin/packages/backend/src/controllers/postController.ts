import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/backend/src/persistance/database";
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { parseForResponse } from "@dddforum/shared/utils/utils";
import { ErrorExceptionHandler } from "@dddforum/shared/errorsAndExceptions/errorExceptionHandler";
import { PostService } from "@/services/postService";

const prisma = new PrismaClient();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

export class PostController {
  private router: express.Router;

  constructor(
    private postService: PostService,
    private errorHandler: ErrorExceptionHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  private setupRoutes() {
    this.router.get("/", this.getPosts);
  }

  async getPosts(req: Request, res: Response, next: express.NextFunction) {
    try {
      const { sort } = req.query;
      const response = await this.postService.getPosts(sort as string)

      // if (sort !== "recent") {
      //   return res
      //     .status(400)
      //     .json({ error: Errors.ClientError, data: undefined, success: false });
      // }

      // let postsWithVotes = await prisma.post.findMany({
      //   include: {
      //     votes: true, // Include associated votes for each post
      //     memberPostedBy: {
      //       include: {
      //         user: true
      //       }
      //     },
      //     comments: true
      //   },
      //   orderBy: {
      //     dateCreated: 'desc', // Sorts by dateCreated in descending order
      //   },
      // });

      return res.json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
