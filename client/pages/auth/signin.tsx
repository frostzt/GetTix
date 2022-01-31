import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RequestTypes, useRequest } from "../../hooks/use-request";

const Signin: NextPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    body: { email, password },
    method: RequestTypes.POST,
    url: "/api/users/signin",
    onSuccess: () => router.replace("/"),
  });

  useEffect(() => {
    if (errors) {
      errors.map((err) => {
        toast.error(err.message);
      });
    }
  }, [errors]);

  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <React.Fragment>
      <Head>
        <title>Signin | GetTix</title>
        <meta name="description" content="Signup and create an account" />
      </Head>
      <form className="p-6" onSubmit={onSubmit}>
        <h1 className="text-3xl font-bold mb-5">Sign in</h1>
        <div className="flex flex-col">
          <label className="text-lg">Email</label>
          <input
            type="text"
            value={email}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="border-gray-500 border-2 rounded-md py-1 px-2"
          />
        </div>
        <div className="flex flex-col mt-2">
          <label className="text-lg">Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="border-gray-500 border-2 rounded-md py-1 px-2"
          />
        </div>
        <button className="mt-5 bg-blue-500 shadow-lg shadow-blue-500/50 text-white w-fit h-fit px-4 py-2 rounded-md">
          Sign In
        </button>
      </form>
    </React.Fragment>
  );
};

export default Signin;
