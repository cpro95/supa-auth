import React from "react";
import { useState } from "react";
import { GetServerSideProps } from "next";
import classNames from "classnames";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import { useFormFields } from "../lib/utils";
import { useMessage } from "../lib/message";

type FormFieldProps = {
  password: string;
  password2: string;
};

const FORM_VALUES: FormFieldProps = {
  password: "",
  password2: "",
};
const ProfilePage = ({ user }) => {
  const { signOut, updatePassword } = useAuth();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [values, handleChange, resetFormFields] =
    useFormFields<FormFieldProps>(FORM_VALUES);
  const { messages, handleMessage } = useMessage();

  // Form submit handler to call the above function
  const handleSumbit = (event: React.FormEvent) => {
    event.preventDefault();
    if (values.password !== values.password2) {
      resetFormFields();
      handleMessage({
        message: `Typed passwords are not identical`,
        type: "error",
      });
    } else {
      updatePassword({ password: values.password });
      resetFormFields();
    }
  };

  // Client side protected route
  // useEffect(() => {
  //   if (!userLoading && !loggedIn) {
  //     Router.push("/auth");
  //   }
  // }, [userLoading, loggedIn]);

  // if (userLoading) {
  //   return <div>Loading...</div>;
  // }

  function alterPassword() {
    setChangePassword(!changePassword);
  }

  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <h2 className="text-4xl my-4">
        Hello, {user && user.email ? user.email : "Supabase User!"}
      </h2>
      <h3 className="text-xl my-4">You are in Profile Page.</h3>
      {user && (
        <div className="flex flex-row items-center justify-center space-x-4 mb-4">
          <button
            className="bg-transparent hover:bg-blue-600 text-sm text-blue-600 hover:text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg"
            onClick={signOut}
          >
            Log Out
          </button>
          <div>or</div>
          <button
            className="bg-transparent hover:bg-gray-600 text-sm text-gray-600 hover:text-white font-semibold py-2 px-4 border border-gray-500 hover:border-transparent rounded-lg"
            onClick={alterPassword}
          >
            Change Password
          </button>
        </div>
      )}
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

      {changePassword && (
        <form
          onSubmit={handleSumbit}
          className="bg-white shadow-md rounded w-1/2 mt-4 px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="New password"
              required
              value={values.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Repeat New Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password2"
              name="password2"
              type="password"
              placeholder="Repeat password"
              required
              value={values.password2}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-transparent hover:bg-red-500 text-sm text-red-500 hover:text-white font-semibold py-2 px-4 border border-green-400 hover:border-transparent rounded-lg"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;

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
