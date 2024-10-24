import { Database } from "@dddforum/backend/src/persistance/database";
import { CreateUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";
import { EmailTakenException, UsernameTakenException } from "@dddforum/shared/errorsAndExceptions/exceptions";

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

        const response = await this.db.users.save({firstName, lastName, username, email, password})

        return response
    }

    async getUserByEmail(dto: CreateUserDTO) {
        const email = dto.email

        const response = await this.db.users.getByEmail(email)

        return response
    }
}