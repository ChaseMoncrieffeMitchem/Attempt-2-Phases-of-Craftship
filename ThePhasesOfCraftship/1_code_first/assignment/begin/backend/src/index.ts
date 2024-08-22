import express, { Request, Response } from 'express';
import cors from 'cors'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Fetch all users
  const users = await prisma.users_Table.findMany();
  console.log(users);

  // Create Users
  try {
    const newUser = await prisma.users_Table.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123', // Make sure to hash passwords before storing them in production
      },
    });

    console.log('User created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const app = express();
app.use(express.json());
app.use(cors())

// Create a new user
app.post('/users/new', async (req: Request, res: Response) => {
  // ...
});

// Edit a user
app.post('/users/edit/:userId', async (req: Request, res: Response) => {
  // ...
});

// Get a user by email
app.get('/users', async (req: Request, res: Response) => {
  // ...
});

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send("Server is running!")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});