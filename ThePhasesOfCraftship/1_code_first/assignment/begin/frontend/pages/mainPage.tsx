import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postList";
import { PostViewSwitcher } from "../components/postViewSwitcher";
import { Post } from "../components/postList"
import { api } from "../components/registrationForm";

export const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      const result = await api.fetchPosts();
      if (result.success && result.data) {
        setPosts(result.data);
      } else {
        console.error('Failed to fetch posts:', result.errorMessage);
      }
    };

    fetchAndSetPosts();
  }, []);

  return (
    <Layout>
      <PostViewSwitcher />
      <PostsList
        posts={posts}
      />
    </Layout>
  );
};
