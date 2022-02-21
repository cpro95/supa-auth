import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useMessage } from "../../lib/message";
import { useFormFields } from "../../lib/utils";
import { supabase } from "../../lib/supabase";
import { User } from "@supabase/supabase-js";
import classNames from "classnames";

type FormFieldProps = {
  title: string;
  content: string;
};

const FORM_VALUES: FormFieldProps = {
  title: "",
  content: "",
};

const ModifyPost = ({ user }: { user: User }) => {
  const { messages, handleMessage } = useMessage();
  const [values, handleChange, resetFormFields] =
    useFormFields<FormFieldProps>(FORM_VALUES);
  const [refresh, setRefresh] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", Number(id))
      .limit(1)
      .single();
    if (error) {
      console.log(error);
      handleMessage({ message: "Error : No post", type: "error" });
    } else {
      values.title = post.title;
      values.content = post.content;
      setRefresh(!refresh);
    }
  };
  const handleSumbit = async (event: React.FormEvent) => {
    console.log(user);
    event.preventDefault();
    const { data, error } = await supabase
      .from("posts")
      .update([
        {
          title: values.title,
          content: values.content,
        },
      ])
      .match({
        id: Number(id),
      });

    if (error) {
      console.log(error);
      handleMessage({
        message: "Error : Create A Post",
        type: "error",
      });
    } else {
      console.log(data);
      handleMessage({
        message: "Success : Modified A Post",
        type: "success",
      });
    }
    resetFormFields();
    router.push("/posts");
  };

  const deletePost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .match({
        id: Number(id),
      });
    if (error) {
      console.log(error);
      handleMessage({
        message: "Error : Delete A Post",
        type: "error",
      });
    } else {
      console.log(data);
      handleMessage({
        message: "Success : Deleted A Post",
        type: "success",
      });
    }
    router.push("/posts");
  };

  return (
    <div className="flex flex-col items-center justify-start py-4 min-h-screen">
      <h2 className="text-lg my-4">
        Hello, {user && user.email ? user.email : "Supabase User!"}
      </h2>
      {messages &&
        messages.map((message, index) => (
          <div
            key={index}
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

      <h1 className="py-3 font-semibold text-2xl text-blue-600">
        Modify a Post
      </h1>

      <form
        onSubmit={handleSumbit}
        className="bg-white w-3/4 md:w-1/2 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            name="title"
            required
            value={values.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            className="h-72 shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
            name="content"
            value={values.content}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Modify
          </button>
          <a
            className="bg-transparent hover:bg-gray-600 text-sm text-gray-600 hover:text-white font-semibold py-2 px-4 border border-gray-500 hover:border-transparent rounded-lg"
            onClick={deletePost}
          >
            Delete
          </a>
        </div>
      </form>
    </div>
  );
};

export default ModifyPost;

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

  console.log(req.url);
  const id = require("url").parse(req.url, true).query.id;
  console.log(id);

  return {
    props: {
      user,
      loggedIn: !!user,
    },
  };
};
