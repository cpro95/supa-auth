import Head from "next/head";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <Head>
        <title>Supabase Auth Tutorial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-6xl font-bold">
        Welcome to{" "}
        <a className="text-blue-600" href="https://nextjs.org">
          Next.js! with Supabase
        </a>
      </h1>
    </div>
  );
}