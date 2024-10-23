import { Errors } from "@dddforum/shared/errorsAndExceptions/constants";
import { Database } from "@dddforum/shared/persistance/database"
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from 'express';

const prisma = new PrismaClient()
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())


export class PostController {

    constructor(private database: Database) {}

    async getPosts (req: Request, res: Response) {
        try {
          const { sort } = req.query;
          
          if (sort !== 'recent') {
            return res.status(400).json({ error: Errors.ClientError, data: undefined, success: false })
          } 
      
          let postsWithVotes = await prisma.post.findMany({
            include: {
              votes: true, // Include associated votes for each post
              memberPostedBy: {
                include: {
                  user: true
                }
              },
              comments: true
            },
            orderBy: {
              dateCreated: 'desc', // Sorts by dateCreated in descending order
            },
          });
      
          return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true });
        } catch (error) {
          return res.status(500).json({ error: Errors.ServerError, data: undefined, success: false });
        }
      }
}