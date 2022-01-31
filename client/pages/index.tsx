import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { buildClient } from "../api/build-client";

interface HomePageProps {
  currentUser: {
    id: string;
    email: string;
  };
}

const Home: NextPage<HomePageProps> = ({ currentUser }) => {
  return (
    <>
      <Head>
        <title>GetTix | Just get a ticket man!</title>
      </Head>
      <div>This is the landing page</div>
      {currentUser ? (
        <div>Signed in as {currentUser.email}</div>
      ) : (
        <div>You&apos;re not signed in!</div>
      )}
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data } = await buildClient(ctx).get("/api/users/currentuser");

  return {
    props: data,
  };
};
