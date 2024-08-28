import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import arrow from '../public/assets/arrow.svg';
import { api } from './registrationForm';

type Vote = { id: number; postId: number; voteType: 'Upvote' | 'Downvote' };
type Comment = {}; // Define Comment type if needed

export type Post = {
  title: string;
  dateCreated: string;
  memberPostedBy: any;
  comments: Comment[];
  votes: Vote[];
};

interface PostsListProps {
  posts: Post[];
}

function computeVoteCount(votes: Vote[]) {
  let count = 0;
  votes.forEach((v) => v.voteType === 'Upvote' ? count++ : count--);
  return count;
}



export const PostsList: React.FC<PostsListProps> = ({ posts }) => {
  return (
    <div className="posts-list">
      {posts.map((post, key) => (
        <div className="post-item" key={key}>
          <div className="post-item-votes">
            <div className="post-item-upvote">
              <img src={arrow} alt="Upvote" />
            </div>
            <div>{computeVoteCount(post.votes)}</div>
            <div className="post-item-downvote">
              <img src={arrow} alt="Downvote" />
            </div>
          </div>
          <div className="post-item-content">
            <div className="post-item-title">{post.title}</div>
            <div className="post-item-details">
              <div>{moment(post.dateCreated).fromNow()}</div>
              <Link href={`/member/${post.memberPostedBy.user.username}`}>
                by {post.memberPostedBy.user.username}
              </Link>
              <div>
                {post.comments.length}{' '}
                {post.comments.length !== 1 ? 'comments' : 'comment'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
