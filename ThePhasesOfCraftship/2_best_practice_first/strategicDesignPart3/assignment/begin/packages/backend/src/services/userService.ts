import { Database } from "@dddforum/backend/src/persistance/database";
import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import {
  EmailTakenException,
  UsernameTakenException,
  UserNotFoundException,
} from "@dddforum/shared/errorsAndExceptions/exceptions";
import { generateRandomPassword } from "@dddforum/shared/utils/utils";

export class UserServices {
  constructor(private db: Database) {}

  async createUser(dto: CreateUserDTO) {
    const { firstName, lastName, username, email } = dto;
    console.log(firstName, lastName, username, email)

    const existingUserByEmail = await this.db.users.getByEmail(email);
    console.log(existingUserByEmail)
    if (existingUserByEmail) {
      throw new EmailTakenException();
    }

    const existingUserByUsername = await this.db.users.getByUsername(username);
    if (existingUserByUsername) {
      throw new UsernameTakenException();
    }

    const response = await this.db.users.save({
      username, 
      firstName,
      lastName,
      email
    });
    console.log(response)
    return response;
  }

  async getUserByEmail(email: string) {
    const user = await this.db.users.getByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
