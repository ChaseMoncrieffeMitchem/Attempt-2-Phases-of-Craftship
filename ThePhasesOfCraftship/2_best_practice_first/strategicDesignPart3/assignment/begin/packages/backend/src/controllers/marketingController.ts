import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/backend/src/persistance/database";
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { MarketingService } from "@/services/marketingService";
import { ErrorExceptionHandler } from "@dddforum/shared/errorsAndExceptions/errorExceptionHandler";
import { parseForResponse } from "@dddforum/shared/utils/utils";
import { MarketingDTO } from "@dddforum/shared/dtos/marketing/marketingDTO"

const prisma = new PrismaClient();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

function isMissingKeys(data: any, keysToCheckFor: string[]) {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
}

// function generateRandomPassword(length: number): string {
//   const charset =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
//   const passwordArray = [];

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     passwordArray.push(charset[randomIndex]);
//   }

//   return passwordArray.join("");
// }

// function parseUserForResponse(user: any) {
//   const returnData = JSON.parse(JSON.stringify(user));
//   delete returnData.password;
//   return returnData;
// }

export class MarketingController {
  private contactListAPI: ContactListAPI;
  private router: express.Router;

  constructor(
    private marketingService: MarketingService,
    private errorHandler: ErrorExceptionHandler
  ) {
    this.contactListAPI = new ContactListAPI();
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
    this.router.get("/", this.addEmailToMarketingList);
    this.router.get("/negative", this.doNotAddEmailToMarketingList);
  }

  async addEmailToMarketingList(
    req: Request,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      
      MarketingDTO.validate(req.body)

      const marketingDTO = MarketingDTO.fromRequest(req.body);

      const { email } = marketingDTO;

      const response = await this.marketingService.addToEmailList(email)

      // if (!addedToList) {
      //   return res.status(400).json({
      //     error: Errors.ContactListAPI,
      //     data: undefined,
      //     success: false,
      //   });
      // }

      return res
        .status(201)
        .json({ error: undefined, data: parseForResponse(response), success: true });
    } catch (error) {
      next(error);
    }
  }

  async doNotAddEmailToMarketingList(req: Request, res: Response, next: express.NextFunction) {
    try {

      MarketingDTO.validate(req.body)

      const marketingDTO = MarketingDTO.fromRequest(req.body)

      const { email } = marketingDTO
      // const keyIsMissing = isMissingKeys(req.body, ["email"]);

      // if (keyIsMissing) {
      //   return res.status(400).json({
      //     error: Errors.ValidationError,
      //     data: undefined,
      //     success: false,
      //   });
      // }

      const response =
        await this.marketingService.doNotAddToEmailList(email)

      // if (!notAddedToList) {
      //   return res.status(400).json({
      //     error: Errors.ContactListAPI,
      //     data: undefined,
      //     success: false,
      //   });
      // }

      return res
        .status(201)
        .json({ error: undefined, data: parseForResponse(response), success: true });
    } catch (error) {
      next(error)
    }
  }
}
