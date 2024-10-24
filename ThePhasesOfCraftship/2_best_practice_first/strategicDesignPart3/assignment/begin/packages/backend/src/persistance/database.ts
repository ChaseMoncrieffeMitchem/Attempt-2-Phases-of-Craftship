import { PrismaClient } from "@prisma/client";

interface UserPersistence {
    save(userData: UserData): any;
    getByEmail(email: string): any;
}

type UserData = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class Database {
    public users: UserPersistence


    
    constructor(private prisma: PrismaClient) {
        this.prisma = new PrismaClient()
        this.users = this.buildUserPersistence();
    }

    private buildUserPersistence(): UserPersistence {
        return {
            save: this.saveUser,
            getByEmail: this.getUserByEmail,
        }
    }

    private async saveUser(userData: UserData) {
        const data = await this.prisma.user.create({data: userData})

        return data
    }

    private async getUserByEmail(email: string) {
        const data = await this.prisma.user.findUnique({
            where: { email },
            include: {
                member: {
                    include: {
                        posts: true,     // Include related posts
                        votes: true,     // Include related votes
                        comments: true   // Include related comments
                    }
                }
            }
        });
    
        return data;
    }
    

    public async connect (): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            return this.prisma.$connect()
            .then(() => {
                console.log('Connection to the database successful')
                return resolve(true)
            })
            .catch((err) => {
                return reject(false)
            })
        })
    }

    // public async disconnect () {

    // }

    public async testConnection(): Promise<boolean> {
        try {
            const result: { sum: bigint }[] = await this.prisma.$queryRaw<{ sum: bigint }[]>`SELECT 1 + 1 AS sum`;
    
            // Convert the BigInt result to a number before comparing
            if (Number(result[0]?.sum) === 2) {
                return true;
            }
    
            return false;
        } catch (err) {
            return false; // Return false if there's an error
        }
    }
    
    
    

    public async getConnection () {
        return this.prisma
    }
}