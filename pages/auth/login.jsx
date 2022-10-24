import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  //Sign in with google
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
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
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="py-4 text-xl">Sign in with one of the providers</h2>
      <div className="py-4">
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 font-medium rounded-lg flex align-middle py-3 px-5 gap-4"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
