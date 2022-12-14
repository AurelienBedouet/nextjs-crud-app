import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const SignOut = () => {
    auth.signOut();
    toast.success("Successfully logged out!");
    router.push("/");
  };

  return (
    <nav className="w-[95%] mx-auto xl:max-w-[1280px] 2xl:w-full flex justify-between items-center py-3">
      <Link href="/">
        <a className="text-xl font-bold tracking-widest text-gray-600">
          Creative Minds
        </a>
      </Link>

      {!user && (
        <Link href={"/auth/signin"}>
          <a className="app__buttons bg-white text-cyan-500 border-cyan-500">
            Sign In
          </a>
        </Link>
      )}

      {user && (
        <ul className="flex items-center gap-4">
          <Link href="/post">
            <button className="app__buttons">Post</button>
          </Link>
          <button
            className="app__buttons bg-white text-cyan-500 border-cyan-500"
            onClick={SignOut}
          >
            Sign Out
          </button>
          <Link href="/dashboard">
            <Image
              src={user.photoURL || "/hacker.png"}
              width={40}
              height={40}
              alt={`${user.displayName}'s profile picture`}
              className="rounded-full cursor-pointer"
            />
          </Link>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
