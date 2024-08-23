import React, { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { PostsList } from "../../components/postList";
import { PostViewSwitcher } from "../../components/postViewSwitcher";
import { api } from "../api";

export const MainPage = () => {
  const posts = [{ ... }];

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList
        posts={posts}
      />
    </Layout>
  );
};
