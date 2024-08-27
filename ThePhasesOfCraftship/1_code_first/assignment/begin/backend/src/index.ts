import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient, Users_Table } from "@prisma/client";

const prisma = new PrismaClient();

const Errors = {
  UsernameAlreadyTaken: "UserNameAlreadyTaken",
  EmailAlreadyInUse: "EmailAlreadyInUse",
  ValidationError: "ValidationError",
  ServerError: "ServerError",
  ClientError: "ClientError",
  UserNotFound: "UserNotFound",
};

async function main() {
  // Example: Fetch all users
  const users = await prisma.users_Table.findMany();
  console.log(users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const app = express();
app.use(express.json());
app.use(cors());

function generateRandomPassword(length: number): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const passwordArray = [];

  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset[randomIndex]);
  }

  return passwordArray.join("");
}

function parseUserForResponse(user: Users_Table) {
  // Convert user object to plain object, then handle the BigInt conversion
  const returnData = JSON.parse(JSON.stringify(user, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
  
  // Remove the password field
  delete returnData.password;

  return returnData;
}


// Create a new user
app.post("/users/new", async (req: Request, res: Response) => {
  try {
    const userData = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res
        .status(400)
        .json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
    }

    const anExistingUserFoundByUsername = await prisma.users_Table.findFirst({
      where: { username: req.body.username },
    });
    if (anExistingUserFoundByUsername) {
      return res
        .status(409)
        .json({
          error: Errors.UsernameAlreadyTaken,
          data: undefined,
          success: false,
        });
    }

    const anExistingUserFoundByEmail = await prisma.users_Table.findFirst({
      where: { email: req.body.email },
    });
    if (anExistingUserFoundByEmail) {
      return res
        .status(409)
        .json({
          error: Errors.EmailAlreadyInUse,
          data: undefined,
          success: false,
        });
    }

    const user = await prisma.users_Table.create({
      data: { ...userData, password: generateRandomPassword(10) },
    });

    return res.status(201).json({
      error: undefined,
      data: parseUserForResponse(user),
      success: true,
    });
  } catch (error) {
    console.log("Cannot create user", error);
    return res.status(500).json({
      error: Errors.ServerError,
      data: undefined,
      success: false,
    });
  }
});

// Edit a user
app.post("/users/edit/:userId", async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const { userId } = req.params;

    const user = await prisma.users_Table.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) {
      return res.status(404).json({
        error: Errors.UserNotFound,
        data: undefined,
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res
        .status(400)
        .json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
    }

    const usernameAlreadyTaken = await prisma.users_Table.findFirst({
      where: { username: req.body.username },
    });
    if (usernameAlreadyTaken) {
      return res.status(409).json({
        error: Errors.UsernameAlreadyTaken,
        data: undefined,
        success: false,
      });
    }

    const emailAlreadyTaken = await prisma.users_Table.findFirst({
      where: { email: req.body.email },
    });
    if (emailAlreadyTaken) {
      return res.status(409).json({
        error: Errors.EmailAlreadyInUse,
        data: undefined,
        success: false,
      });
    }

    const updateUser = await prisma.users_Table.update({
      where: { id: BigInt(userId) },
      data: {
        email: userData.email || user.email,
        username: userData.username || user.username,
        firstName: userData.firstName || user.firstName,
        lastName: userData.lastName || user.lastName,
      },
    });

    const serializeUser = (user: any) => {
        return {
          ...user,
          id: user.id.toString(),  // Convert BigInt to string
        };
      };

    return res.status(200).json({
      error: undefined,
      data: serializeUser(updateUser),
      success: true,
    });
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({
      error: Errors.ServerError,
      data: undefined,
      success: false,
    });
  }
});

// Get a user by email
app.get("/users", async (req: Request, res: Response) => {
  try {
    const { email } = req.query as { email: string }

    if (!email) {
      return res.status(404).json({
        error: Errors.UserNotFound,
        data: undefined,
        success: false,
      });
    }

    const user = await prisma.users_Table.findFirst({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({
        error: "UserNotFound",
        data: undefined,
        success: false,
      });
    }

    return res.status(200).json({
      error: undefined,
      data: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      success: true,
    });
  } catch (error) {
    console.error("Server Error:", error)
    return res.status(500).json({
      error: Errors.ServerError,
      data: undefined,
      success: false,
    });
  }
});

const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
