import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter, FaGithub } from "react-icons/fa";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import EmailSignIn from "../../components/EmailSignIn";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  //Sign in with google
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    }
  };

  // const TwitterLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     toast.success("Login successful");
  //     router.push("/");
  //   } catch (error) {
  //     toast.error("Login failed");
  //     console.log(error);
  //   }
  // };

  // const GithubLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     toast.success("Login successful");
  //     router.push("/");
  //   } catch (error) {
  //     toast.error("Login failed");
  //     console.log(error);
  //   }
  // };

  const AnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      toast.error("Login failed");
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      console.log("login");
    }
  });

  return (
    <div>
      {/* Login with email / password */}
      <EmailSignIn />

      {/* Login with Google / Twitter / Github */}
      <div className="mt-4">
        <div className="py-4 flex flex-wrap gap-6">
          <button
            onClick={GoogleLogin}
            className="w-fit text-sm text-white bg-gray-700 font-medium rounded-lg flex items-center py-3 px-4 gap-4 hover:opacity-90"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
          <button
            // onClick={TwitterLogin}
            className="w-fit text-sm text-white bg-gray-700 font-medium rounded-lg flex items-center py-3 px-4 gap-4 hover:opacity-90"
          >
            <FaTwitter className="text-2xl text-[#1DA1F2]" />
            Sign in with Twitter
          </button>
          <button
            // onClick={GithubLogin}
            className="w-fit text-sm text-white bg-gray-700 font-medium rounded-lg flex items-center py-3 px-4 gap-4 hover:opacity-90"
          >
            <FaGithub className="text-2xl" />
            Sign in with Github
          </button>
          <button
            onClick={AnonymousLogin}
            className="w-fit text-sm text-white bg-gray-700 font-medium rounded-lg flex items-center py-3 px-4 gap-4 hover:opacity-90"
          >
            <Image src="/hacker.png" alt="hacker" width={24} height={24} />
            Sign in Anonymously
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
