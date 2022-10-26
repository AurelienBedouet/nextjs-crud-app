import React, { useState } from "react";
import Link from "next/link";
import { AiFillLock, AiOutlineMail } from "react-icons/ai";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created with success!");
      router.push("/");
    } catch (e) {
      setError(e.message);
      toast.error("Something went wrong!");
      console.log(e.message);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto min-h-[480px] px-4 py-8 mt-36">
      <h1 className="text-2xl font-medium">Sign Up</h1>

      {/* Error Handling */}
      {error ? <p className="bg-red-300 p-3 my-2">{error}</p> : null}

      {/* Start Form */}
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="my-4">
          <label>Email</label>
          <div className="my-2 w-full relative rounded-lg shadow-xl">
            <input
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 bg-primary border border-input rounded-lg"
              type="email"
            />
            <AiOutlineMail className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Password */}
        <div className="my-4">
          <label>Password</label>
          <div className="my-2 w-full relative rounded-lg shadow-xl">
            <input
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 bg-primary border border-input rounded-lg"
              type="password"
            />
            <AiFillLock className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Sign In Button */}
        <button className="app__buttons border-cyan-500 w-full my-2 p-2 shadow-xl">
          Sign Up
        </button>
      </form>
      {/* End Form */}

      <div className="flex gap-4 items-center">
        <p className="my-4 font-light">Already have an account ?</p>
        <Link href="/auth/signin">
          <a className="text-gray-700 font-medium">Sign In</a>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
