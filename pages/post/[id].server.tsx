import { useEffect, useState } from "react";
import { GetServerSideProps, NextApiRequest } from "next";
import { useMessage } from "../../lib/message";
import { supabase } from "../../lib/supabase";
import { User } from "@supabase/supabase-js";
import classNames from "classnames";
import { PostsProps } from "../posts";

const PostDetailPage = ({ user, post }: { user: User; post: PostsProps }) => {
  const { messages, handleMessage } = useMessage();
  const [date, setDate] = useState<string>();
  useEffect(() => {
    // null means that post is empty
    if (post === null) {
      // console.log(post);
      handleMessage({ message: "Error : No post", type: "error" });
    } else {
      let postDate = new Date(post.inserted_at);
      setDate(postDate.toLocaleDateString("kr"));
    }
  }, []);

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

      <h3 className="py-3 font-semibold text-lg text-blue-600">
        Post Detail List
      </h3>
      {post && (
        <section className="text-center lg:text-left">
          <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8 lg:items-end lg:justify-between lg:flex">
            <div className="max-w-xl mx-auto lg:ml-0">
              <h1 className="text-sm font-medium tracking-widest text-indigo-600 uppercase">
                {date}
              </h1>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                {post?.title}
              </h2>
            </div>

            <p className="max-w-xs mx-auto mt-4 text-gray-700 lg:mt-0 lg:mr-0">
              {post?.content}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default PostDetailPage;

export type NextAppPageUserPostProps = {
  props: {
    user: User;
    loggedIn: boolean;
    post: PostsProps;
  };
};

export type NextAppPageRedirProps = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type NextAppPageServerSideProps =
  | NextAppPageUserPostProps
  | NextAppPageRedirProps;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
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

  // returned supabase data is basically array, so post is array type
  // but .single() function will return only one object, that is not array type.
  let { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", Number(params?.id))
    .limit(1)
    .single();

  if (!post) {
    console.log(error);
  } else {
    // console.log(post);
  }

  return {
    props: {
      user,
      loggedIn: !!user,
      post,
    },
  };
};
