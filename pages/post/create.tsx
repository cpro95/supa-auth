import React from "react";
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

const CreatePost = ({ user }: { user: User }) => {
  const { messages, handleMessage } = useMessage();

  const [values, handleChange, resetFormFields] =
    useFormFields<FormFieldProps>(FORM_VALUES);

  const handleSumbit = async (event: React.FormEvent) => {
    // console.log(user);
    event.preventDefault();
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        user_email: user.email,
        title: values.title,
        content: values.content,
      },
    ]);

    if (error) {
      console.log(error);
      handleMessage({
        message: "Error : Create A Post",
        type: "error",
      });
    } else {
      console.log(data);
    }
    resetFormFields();
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
        Create a Post
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

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
