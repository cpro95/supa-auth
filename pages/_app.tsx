import React from "react";
import Head from "next/head";
import "../styles/globals.css";

import Layout from "../components/Layout";
import { AuthProvider } from "../lib/auth";
import { MessageProvider } from "../lib/message";

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <MessageProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </MessageProvider>
    </React.Fragment>
  );
}

export default MyApp;
