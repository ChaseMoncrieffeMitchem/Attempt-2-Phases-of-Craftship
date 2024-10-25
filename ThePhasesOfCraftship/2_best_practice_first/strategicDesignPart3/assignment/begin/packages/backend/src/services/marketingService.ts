import { Database } from "@/persistance/database";
import { InvalidContactListException } from "@dddforum/shared/errorsAndExceptions/exceptions";

export class MarketingService {
    constructor(private db: Database) {}

    async addToEmailList(email: string) {
        const result = await this.db.marketing.addToEmailList(email)

        if (!result) {
            throw new InvalidContactListException
        }

        return result
    }
}