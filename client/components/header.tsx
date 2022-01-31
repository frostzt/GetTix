import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { RequestTypes, useRequest } from "../hooks/use-request";
import { ICurrentUser } from "../pages/_app";

interface HeaderProps {
  currentUser: ICurrentUser | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const router = useRouter();
  const { doRequest } = useRequest({
    body: {},
    url: "/api/users/signout",
    method: RequestTypes.POST,
    onSuccess: () => router.replace("/"),
  });

  const signOut = () => {
    doRequest();
  };

  return (
    <div className="w-full bg-zinc-900 flex py-6 px-5 justify-between mb-3">
      <NextLink href="/">
        <div className="font-semibold text-blue-50 text-xl cursor-pointer">
          GetTix
        </div>
      </NextLink>
      {currentUser && (
        <div onClick={signOut} className="text-blue-50 cursor-pointer">
          Sign out
        </div>
      )}
      {!currentUser && (
        <div className="flex">
          <NextLink href="/auth/signin">
            <div className="text-blue-50 mr-4 cursor-pointer">Sign in</div>
          </NextLink>
          <NextLink href="/auth/signup">
            <div className="text-blue-50 cursor-pointer">Sign up</div>
          </NextLink>
        </div>
      )}
    </div>
  );
};

export default Header;
