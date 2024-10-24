import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/backend/src/persistance/database"
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from 'express';
import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import { userServices } from "@/services/users";

const prisma = new PrismaClient()
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
const contactListAPI = new ContactListAPI();

function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
  }

  function generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const passwordArray = [];
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      passwordArray.push(charset[randomIndex]);
    }
  
    return passwordArray.join('');
  }

  function parseUserForResponse (user: any) {
    const returnData = JSON.parse(JSON.stringify(user));
    delete returnData.password;
    return returnData;
  }

export class UserController {
    constructor(private userService: userServices) {}
  
    async createUser(req: Request, res: Response) {
      try {

        const dto = CreateUserDTO.formRequest(req.body)
        const response = await this.userService.createUser(dto)
        // const keyIsMissing = isMissingKeys(req.body, ['email', 'firstName', 'lastName', 'username']);
        // if (keyIsMissing) {
        //   return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false });
        // }
  
        const userData = response
        // const email = req.body.email

        // if (!email.includes('.com')) {
        //   return res.status(409).json({ error: Errors.InvalidEmail, data: undefined, success: false });
        // }
  
        // Check if email is already in use
        // const existingUserByEmail = await prisma.user.findFirst({ where: { email: req.body.email } });
        // if (existingUserByEmail) {
        //   return res.status(409).json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false });
        // }
  
        // Check if username is already taken
        const existingUserByUsername = await prisma.user.findFirst({ where: { username: req.body.username as string } });
        if (existingUserByUsername) {
          return res.status(409).json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false });
        }
  
        // Create the user and associated member in a transaction
        const { user, member } = await prisma.$transaction(async () => {
          const user = await prisma.user.create({
            data: { ...userData, password: generateRandomPassword(10) },
          });
          const member = await prisma.member.create({
            data: { userId: user.id },
          });
          return { user, member };
        });
  
        return res.status(201).json({ error: undefined, data: parseUserForResponse(user), success: true });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
      }
    }

    async getUserByEmail (req: Request, res: Response) {
        try {
          const email = req.query.email as string;
          if (email === undefined) {
            return res.status(400).json({ error: Errors.ValidationError, data: undefined, success: false })
          }
          
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            return res.status(404).json({ error: Errors.UserNotFound, data: undefined, success: false })
          }
      
          return res.status(200).json({ error: undefined, data: parseUserForResponse(user), succes: true });
        } catch (error) {
          return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
      }


  }