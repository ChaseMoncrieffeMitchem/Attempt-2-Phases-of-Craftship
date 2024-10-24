import { Post, PrismaClient } from "@prisma/client";
import { CreateUserDTO } from '@dddforum/shared/dtos/user/createUserDTO'
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";

interface UserPersistence {
    save(userData: UserData): any;
    getByEmail(email: string): any;
    getByUsername(username: string): any;
}

interface PostPersistence {
    getPosts(): any;
}

interface MarketingPersistence {
    addToEmailList(email: string): any;
    doNotAddToEmailList(email: string): any;
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
    public posts: PostPersistence
    public marketing: MarketingPersistence
    private contactListAPI: ContactListAPI;

    
    constructor(private prisma: PrismaClient) {
        this.prisma = new PrismaClient()
        this.users = this.buildUserPersistence();
        this.posts = this.buildPostPersistence();
        this.marketing = this.buildMarketingPersistence();
        this.contactListAPI = new ContactListAPI();
    }

    private buildUserPersistence(): UserPersistence {
        return {
            save: this.saveUser,
            getByEmail: this.getUserByEmail,
            getByUsername: this.getUserByUsername,
        }
    }
    
    private buildPostPersistence(): PostPersistence {
        return {
            getPosts: this.getUserPosts,
        }
    }

    private buildMarketingPersistence(): MarketingPersistence {
        return {
            addToEmailList: this.addToMarketingEmailList,
            doNotAddToEmailList: this.doNotAddToMarketingEmailList,
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

    private async getUserByUsername(username: string) {
        
            const data = await this.prisma.user.findFirst({
                where: { username },
                include: {
                    member: {
                        include: {
                            posts: true,     // Include related posts
                            votes: true,     // Include related votes
                            comments: true   // Include related comments
                        }
                    }
                }
            })
        
    }

    private async getUserPosts() {

        const data = await this.prisma.post.findMany({
            include: {
              votes: true, // Include associated votes for each post
              memberPostedBy: {
                include: {
                  user: true
                }
              },
              comments: true
            },
            orderBy: {
              dateCreated: 'desc', // Sorts by dateCreated in descending order
            },
          });

          return data
    }
    
    private async addToMarketingEmailList(email: string): Promise<boolean> {
        const result = await this.contactListAPI.addEmailToList(email);
        return result; 
    }

    private async doNotAddToMarketingEmailList(email: string): Promise<boolean> {
        const result = await this.contactListAPI.doNotAddEmailToList(email);
        return result;
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