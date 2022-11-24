import React, { useState } from "react";
import Link from "next/link";
import { AiFillLock, AiOutlineMail } from "react-icons/ai";
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useAuthState } from "react-firebase-hooks/auth";

const EmailLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // const [user, loading] = useAuthState(auth);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      router.push("/");
    } catch (e) {
      setError(e.message);
      toast.error("Login failed");
      console.log(e.message);
    }
  };

  return (
    <div className="mt-36">
      <h2 className="text-2xl font-medium">Sign In with Email</h2>

      {/* Error Handling */}
      {error ? (
        <p className="bg-red-300 p-3 my-2">Email/Password Incorrect</p>
      ) : null}

      {/* Start Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-8 max-w-lg w-full">
          {/* Email */}
          <div className="my-4 w-full">
            <div className="my-2 relative rounded-lg shadow-xl">
              <input
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="w-full p-2 bg-primary border border-input rounded-lg"
                type="email"
              />
              <AiOutlineMail className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="my-4 w-full">
            <div className="my-2 relative rounded-lg shadow-xl">
              <input
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                className="w-full p-2 bg-primary border border-input rounded-lg"
                type="password"
              />
              <AiFillLock className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <button className="app__buttons border-cyan-500 max-w-lg  shadow-xl w-full mb-2">
          Sign In
        </button>
      </form>
      {/* End Form */}

      <div className="flex gap-4 items-center">
        <p className="my-4 font-light">Do not have an account ?</p>
        <Link href="/auth/signup">
          <a className="text-gray-700 font-medium">Sign Up</a>
        </Link>
      </div>
    </div>
  );
};

export default EmailLogin;
