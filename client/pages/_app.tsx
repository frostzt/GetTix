import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { buildClient } from "../api/build-client";
import Header from "../components/header";

export interface ICurrentUser {
  id: string;
  email: string;
}

function MyApp({
  Component,
  pageProps,
  currentUser,
}: AppProps & { currentUser: ICurrentUser | null }) {
  return (
    <>
      <Toaster />
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }: any) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default MyApp;
