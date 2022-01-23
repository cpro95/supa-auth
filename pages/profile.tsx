import Link from "next/link";
import { GetServerSideProps } from "next";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

const ProfilePage = ({ user }) => {
  const { signOut } = useAuth();

  // useEffect(() => {
  //   if (!userLoading && !loggedIn) {
  //     Router.push("/auth");
  //   }
  // }, [userLoading, loggedIn]);

  // if (userLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <h2 className="text-4xl my-4">
        Hello, {user && user.email ? user.email : "Supabase User!"}
      </h2>
      {!user && (
        <div>
          You have landed on a protected page.
          <br />
          Please{"  "}
          <Link href="/auth">
            <a className="font-bold text-blue-500">Log In</a>
          </Link>{" "}
          to view the page's full content.
        </div>
      )}
      {user && (
        <div>
          <button
            className="border bg-gray-500 border-gray-600 text-white px-3 py-2 rounded w-full text-center transition duration-150 shadow-lg"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
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
