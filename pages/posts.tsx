import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useMessage } from "../lib/message";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import classNames from "classnames";

export interface PostsProps {
  id: number;
  user_id: string;
  user_email: string;
  title: string;
  content: string;
  inserted_at: Date;
}

const ListPosts = ({ post }: { post: PostsProps }) => {
  let postDate = new Date(post?.inserted_at);
  let date = postDate.toLocaleDateString("kr");

  return (
    <li>
      <div className="flex flex-wrap items-center sm:-mx-3 mt-12">
        <div className="w-full pb-6 space-y-6 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-4xl">
            <span className="block xl:inline">{post.title}</span>
          </h1>
          <span className="block xl:inline">{post.content}</span>
          <span className="block xl:inline">{date}</span>
        </div>
        <div className="relative flex flex-col sm:flex-row sm:space-x-4 py-4">
          <a
            href={`/post/${post.id}`}
            className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-500 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
          >
            Read the article
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </li>
  );
};

const PostsPage = ({ user }: { user: User }) => {
  // const { signOut } = useAuth();
  const { messages, handleMessage } = useMessage();
  const [posts, setPosts] = useState<PostsProps[]>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("id");
    if (error) {
      console.log(error);
      handleMessage({ message: error.message, type: "error" });
    } else setPosts(posts);
  };

  return (
    <div className="flex flex-col items-center justify-start py-4 min-h-screen">
      <h2 className="text-2xl my-4">Hello, Supabase User!</h2>
      {messages &&
        messages.map((message) => (
          <div
            className={classNames(
              "shadow-md rounded px-3 py-2 text-shadow transition-all mt-2 text-center",
              message.type === "error"
                ? "bg-red-500 text-white"
                : message.type === "success"
                ? "bg-green-300 text-gray-800"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {message.message}
          </div>
        ))}

      <h3 className="py-3 font-semibold text-lg text-blue-600">Posts List</h3>
      <ul>
        {posts &&
          posts.map((post: PostsProps) => (
            <ListPosts key={post.id} post={post} />
          ))}
      </ul>
    </div>
  );
};

export default PostsPage;

export type NextAppPageUserProps = {
  props: {
    user: User;
    loggedIn: boolean;
  };
};

export type NextAppPageRedirProps = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type NextAppPageServerSideProps =
  | NextAppPageUserProps
  | NextAppPageRedirProps;

export const getServerSideProps: GetServerSideProps = async ({
  req,
}): Promise<NextAppPageServerSideProps> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      loggedIn: !!user,
    },
  };
};
