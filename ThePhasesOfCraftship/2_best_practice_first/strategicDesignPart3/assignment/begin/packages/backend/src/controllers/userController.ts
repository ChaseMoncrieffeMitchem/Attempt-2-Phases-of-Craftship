import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/backend/src/persistance/database"
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from 'express';
import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import { userServices } from "@/services/userService";
import { ErrorExceptionHandler } from "@dddforum/shared/errorsAndExceptions/errorExceptionHandler"

const prisma = new PrismaClient()
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
const contactListAPI = new ContactListAPI();

  function parseUserForResponse (user: any) {
    const returnData = JSON.parse(JSON.stringify(user));
    delete returnData.password;
    return returnData;
  }

export class UserController {
    private router: express.Router;

    constructor(
        private userService: userServices,
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
        this.router.post("/", this.createUser);
    }

    public async createUser(
        req: Request,
        res: Response,
        next: express.NextFunction,
    ) {
        try {
            const dto = CreateUserDTO.formRequest(req.body);
            const response = await this.userService.createUser(dto);

            res.status(201).json({
                error: undefined,
                data: parseUserForResponse(response),
                success: true
            });
        } catch (error) {
            next(error); // Pass error to the global error handler
        }
    }
    async getUserByEmail (req: Request, res: Response, next: express.NextFunction) {
        try {
          const email = req.query.email as string;
          // if (email === undefined) {
          //   return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
          // }
          
          const user = await this.userService.getUserByEmail(email)
          // if (!user) {
          //   return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false })
          // }
      
          return res.status(200).json({ error: undefined, data: parseUserForResponse(user), succes: true });
        } catch (error) {
          next(error)
        }
      }


  }