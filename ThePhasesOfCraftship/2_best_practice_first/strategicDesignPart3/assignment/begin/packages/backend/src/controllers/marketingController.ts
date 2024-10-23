import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/shared/persistance/database";
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

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

function generateRandomPassword(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const passwordArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join("");
}

function parseUserForResponse(user: any) {
  const returnData = JSON.parse(JSON.stringify(user));
  delete returnData.password;
  return returnData;
}

export class MarketingController {
  private contactListAPI: ContactListAPI;

  constructor(private database: Database) {
    this.contactListAPI = new ContactListAPI();
  }

  async addEmailToMarketingList(req: Request, res: Response) {
    try {
      const keyIsMissing = isMissingKeys(req.body, ["email"]);

      if (keyIsMissing) {
        return res
          .status(400)
          .json({
            error: Errors.ValidationError,
            data: undefined,
            success: false,
          });
      }

      const email = req.body.email;

      const addedToList = await this.contactListAPI.addEmailToList(email);

      if (!addedToList) {
        return res
          .status(400)
          .json({
            error: Errors.ContactListAPI,
            data: undefined,
            success: false,
          });
      }

      return res
        .status(201)
        .json({ error: undefined, data: email, success: true });
    } catch (error) {
      console.log(error);
      // Return a failure error response
      return res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  
}
