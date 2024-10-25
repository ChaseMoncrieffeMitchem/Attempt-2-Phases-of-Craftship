import { Database } from "@dddforum/backend/src/persistance/database"
import { InvalidSortParameter } from "@dddforum/shared/errorsAndExceptions/exceptions"

export class PostService {
    constructor(private db: Database) {}

    async getPosts(sort?: string) {
        if (sort !== "recent") {
            throw new InvalidSortParameter
        }

        const posts = await this.db.posts.getPosts()

        return posts
    }
}