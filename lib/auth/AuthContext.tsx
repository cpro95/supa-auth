import {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  SyntheticEvent,
} from "react";
import Router from "next/router";
import { AuthChangeEvent, User, Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useMessage } from "../message";
import {
  SupabaseAuthPayload,
  SupabaseChangePasswordPayload,
} from "./auth.types";

export type AuthContextProps = {
  user: User;
  signUp: (payload: SupabaseAuthPayload) => void;
  signIn: (payload: SupabaseAuthPayload) => void;
  signInWithGithub: (evt: SyntheticEvent) => void;
  signOut: () => void;
  updatePassword: (payload: SupabaseChangePasswordPayload) => void;
  loading: boolean;
  loggedIn: boolean;
  userLoading: boolean;
};

export const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage } = useMessage();

  // sign-in with github
  const signInWithGithub = async (evt: SyntheticEvent) => {
    evt.preventDefault();
    await supabase.auth.signIn({ provider: "github" });
  };

  // sign-up a user with provided details
  const signUp = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message:
            "Signup successful. Please check your inbox for a confirmation email!",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // sign-in a user with provided details
  const signIn = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signIn(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message: "Log in successful.",
          type: "success",
        });
        handleMessage({ message: `Welcome, ${user.email}`, type: "success" });
      }
    } catch (error) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => await supabase.auth.signOut();

  // change password with provided details
  const updatePassword = async (payload: SupabaseChangePasswordPayload) => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.update(payload);
      if (error) {
        console.log(error);
        handleMessage({ message: error.message, type: "error" });
      } else {
        handleMessage({
          message: "Change Password successful.",
          type: "success",
        });
        handleMessage({ message: `Welcome, ${user.email}`, type: "success" });
      }
    } catch (error) {
      console.log(error);
      handleMessage({
        message: error.error_description || error,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const setServerSession = async (event: AuthChangeEvent, session: Session) => {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  };

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      setUserLoading(false);
      setLoggedIn(true);
      // Router.push("/profile");
    } else {
      setUserLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user! ?? null;
        setUserLoading(false);
        await setServerSession(event, session);
        if (user) {
          setUser(user);
          setLoggedIn(true);
          // Router.push("/profile");
        } else {
          setUser(null);
          setLoading(false);
          setLoggedIn(false);
          Router.push("/auth");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signInWithGithub,
        signOut,
        updatePassword,
        loading,
        loggedIn,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
