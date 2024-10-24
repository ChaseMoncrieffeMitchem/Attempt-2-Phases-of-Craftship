import { Database } from "@dddforum/backend/src/persistance/database";
import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import { EmailTakenException, UsernameTakenException, UserNotFoundException } from "@dddforum/shared/errorsAndExceptions/exceptions";
import { generateRandomPassword } from "@dddforum/shared/utils/utils";

export class userServices {
    constructor(private db: Database) {}

    async createUser(dto: CreateUserDTO) {
        const { firstName, lastName, username, email, password } = dto

        const existingUserByEmail = await this.db.users.getByEmail(email)
        if (existingUserByEmail) {
            throw new EmailTakenException()
        }

        const existingUserByUsername = await this.db.users.getByUsername(username)
        if (existingUserByUsername) {
            throw new UsernameTakenException()
        }

        const { user, member } = await this.db.users.save({ firstName, lastName, username, email, password });

        return { user, member };
    }

    async getUserByEmail(email: string) {
        const user = await this.db.users.getByEmail(email)

        if (!user) {
            throw new UserNotFoundException()
        }

        return user
    }
}