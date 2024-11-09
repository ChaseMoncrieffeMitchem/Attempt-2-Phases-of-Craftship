import { Post, PrismaClient } from "@prisma/client";
import { CreateUserDTO } from '@dddforum/shared/dtos/user/createUserDTO'
import { ContactListAPI } from "@dddforum/shared/src/api/marketing/contactListAPI";
import { generateRandomPassword } from "@dddforum/shared/utils/utils";

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
}

export class Database {
    public users: UserPersistence
    public posts: PostPersistence
    public marketing: MarketingPersistence
    private contactListAPI: ContactListAPI;
    
    constructor(private prisma: PrismaClient) {
        this.users = this.buildUserPersistence();
        this.posts = this.buildPostPersistence();
        this.marketing = this.buildMarketingPersistence();
        this.contactListAPI = new ContactListAPI();
    }

    getConnection () {
        return this.prisma
    }

    async connect() {
        await this.prisma.$connect();
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
            getPosts: this.getAllPosts,
        }
    }

    private buildMarketingPersistence(): MarketingPersistence {
        return {
            addToEmailList: this.addToMarketingEmailList,
            doNotAddToEmailList: this.doNotAddToMarketingEmailList,
        }
    }

    private async saveUser(userData: UserData) {
        try {
            const { email, firstName, lastName, username } = userData
            if (!email || !firstName || !lastName || !username) {
                throw new Error("Missing required fields: email, firstName, lastName, or username");
            }
            const user = await this.prisma.user.create({
                data: {
                    email, firstName, lastName, username,
                    password: generateRandomPassword(10), // Assuming password generation is required
                },
            });
    
            // Create the associated member
            await this.prisma.member.create({
                data: { userId: user.id },
            });
    
            // Return the created user
            return user;
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("User creation failed");
        }
    }
    

    private async getUserByEmail(email: string) {
        const data = await this.prisma.user.findFirst({
            where: { email },
            // include: {
            //     member: {
            //         include: {
            //             posts: {
            //                 include: {
            //                     comments: true, // Include comments for each post
            //                     votes: true     // Include votes for each post
            //                 }
            //             },
            //             votes: true,          // Include member's votes
            //             comments: {           // Include member's comments with replies
            //                 include: {
            //                     replyComments: true
            //                 }
            //             }
            //         }
            //     }
            // }
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
        return data
    }

    private async getAllPosts() {

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

    // private async saveMember(memberData: { userId: number }) {
    //     const data = await this.prisma.member.create({
    //         data: memberData,
    //     });
    //     return data;
    // }

    // public async connect (): Promise<boolean> {
    //     return new Promise(async (resolve, reject) => {
    //         return this.prisma.$connect()
    //         .then(() => {
    //             console.log('Connection to the database successful')
    //             return resolve(true)
    //         })
    //         .catch((err) => {
    //             return reject(false)
    //         })
    //     })
    // }

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
    
    
    

    
}