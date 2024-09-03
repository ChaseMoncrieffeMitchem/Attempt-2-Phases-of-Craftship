import { PrismaClient, Users_Table, Post, Vote, Comment } from "@prisma/client";

const prisma = new PrismaClient();

const initialUsers: Users_Table[] = [
  {
    id: BigInt(1),
    email: "bobvance@gmail.com",
    firstName: "Bob",
    lastName: "Vance",
    username: "bobvance",
    password: '123'
  },
  {
    id: BigInt(2),
    email: "tonysoprano@gmail.com",
    firstName: "Tony",
    lastName: "Soprano",
    username: "tonysoprano",
    password: '123'
  },
  {
    id: BigInt(3),
    email: "billburr@gmail.com",
    firstName: "Bill",
    lastName: "Burr",
    username: "billburr",
    password: '123'
  },
];

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'First post!',
    content: "This is bob vances first post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: BigInt(1),  // Change this to BigInt
  },
  {
    id: 2,
    title: 'Second post!',
    content: "This is bobs second post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: BigInt(1),  // Change this to BigInt
  },
  {
    id: 3,
    title: 'another post',
    content: "This is tonys first post",
    postType: "Text",
    dateCreated: new Date(),
    memberId: BigInt(2),  // Change this to BigInt
  },
  {
    id: 4,
    title: 'Links',
    content: "This is a link post",
    postType: "<https://khalilstemmler.com>",
    dateCreated: new Date(),
    memberId: BigInt(2),  // Change this to BigInt
  },
];

const initialPostVotes: Vote[] = [
  { id: 1, postId: 1, voteType: 'Upvote', memberId: BigInt(1) },  // Change memberId to BigInt
  { id: 2, postId: 2, voteType: 'Upvote', memberId: BigInt(1) },  // Change memberId to BigInt
  { id: 3, postId: 3, voteType: 'Upvote', memberId: BigInt(2) },  // Change memberId to BigInt
  { id: 4, postId: 4, voteType: 'Upvote', memberId: BigInt(2) },  // Change memberId to BigInt
  { id: 5, postId: 3, voteType: 'Upvote', memberId: BigInt(1) },  // Change memberId to BigInt
  { id: 6, postId: 2, voteType: 'Downvote', memberId: BigInt(3) },  // Change memberId to BigInt
];

const initialPostComments: Comment[] = [
  { id: 1, text: 'I posted this!', memberId: BigInt(1), postId: 1, parentCommentId: null },  // Change memberId to BigInt
  { id: 2, text: 'Nice', memberId: BigInt(2), postId: 2, parentCommentId: null }  // Change memberId to BigInt
];

async function seed() {
  try {
    // Seed users
    for (const user of initialUsers) {
      const newUser = await prisma.users_Table.create({
        data: user
      });

      await prisma.member.create({
        data: {
          user: {
            connect: { id: newUser.id },
          },
        },
      });
    }

    // Seed posts
    for (const post of initialPosts) {
      await prisma.post.create({
        data: post,
      });
    }

    // Seed votes
    for (const vote of initialPostVotes) {
      await prisma.vote.create({
        data: vote,
      });
    }

    // Seed comments
    for (const comment of initialPostComments) {
      await prisma.comment.create({
        data: comment,
      });
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
