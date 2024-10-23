
// import express, { Request, Response } from 'express';
// // import { prisma } from './database';
// import { PrismaClient } from '@prisma/client';
// import { Errors } from "@dddforum/shared/errorsAndExceptions/constants"
// import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI"

// const prisma = new PrismaClient()
// const cors = require('cors')
// const app = express();
// app.use(express.json());
// app.use(cors())
// const contactListAPI = new ContactListAPI();

// // const Errors = {
// //   UsernameAlreadyTaken: 'UserNameAlreadyTaken',
// //   EmailAlreadyInUse: 'EmailAlreadyInUse',
// //   ValidationError: 'ValidationError',
// //   ServerError: 'ServerError',
// //   ClientError: 'ClientError',
// //   UserNotFound: 'UserNotFound'
// // }

// function isMissingKeys (data: any, keysToCheckFor: string[]) {
//   for (let key of keysToCheckFor) {
//     if (data[key] === undefined) return true;
//   } 
//   return false;
// }

// function generateRandomPassword(length: number): string {
//   const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
//   const passwordArray = [];

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     passwordArray.push(charset[randomIndex]);
//   }

//   return passwordArray.join('');
// }

// function parseUserForResponse (user: any) {
//   const returnData = JSON.parse(JSON.stringify(user));
//   delete returnData.password;
//   return returnData;
// }

// // Create a new user




// // Get a user by email


// // Get posts


// // Add email to marketing list


// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// prisma.post.findMany({})
//   .then((posts: any) => console.log(posts))
//   .catch((err: unknown) => console.log(err));

//   export { app }