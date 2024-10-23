import { PrismaClient } from "@prisma/client";

export class Database {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()
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