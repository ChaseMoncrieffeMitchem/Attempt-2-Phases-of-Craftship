import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postList";
import { PostViewSwitcher } from "../components/postViewSwitcher";
import { Post } from "../components/postList"
// import { api } from "../api";

export const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <Layout>
      <PostViewSwitcher />
      <PostsList
        posts={posts}
      />
    </Layout>
  );
};
