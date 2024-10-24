import { Database } from "@dddforum/backend/src/persistance/database";
import { createUserDTO } from "@dddforum/shared/dtos/user/createUserDTO";

export class userServices {
    constructor(private db: Database) {}

    async createUser(dto: createUserDTO) {
        const { firstName, lastName, username, email, password } = dto

        const response = await this.db.users.save({firstName, lastName, username, email, password})

        return response
    }

    async getUserByEmail(dto: createUserDTO) {
        const email = dto.email

        const response = await this.db.users.getByEmail(email)

        return response
    }
}