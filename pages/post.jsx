import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { addRandomUsername } from "../utils/helpers";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Post = () => {
  // Form State
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const [disabled, setDisabled] = useState(false);
  const route = useRouter();
  const routeData = route.query;

  // Submit Post
  const submitPost = async e => {
    e.preventDefault();

    // Run Checks for description
    if (!post.description) {
      toast.error("Description Field is empty 😅");
      disableButton();
      return;
    }

    if (post.description.length > 300) {
      toast.error("Maximum 300 characters 😢");
      disableButton();
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL || "/hacker.png",
        username: user.displayName || "anon",
      });
      setPost({ description: "" });
      toast.success("Post successfully published! 🚀 ");
      return route.push("/");
    }
  };

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/signin");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  const disableButton = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold mb-4">
          {post.hasOwnProperty("id") ? "Edit your Post" : "Create a new Post"}
        </h1>
        <div className="flex items-center gap-6">
          <p>
            Your username:{" "}
            <span className="ml-2 font-medium">{user?.displayName}</span>
          </p>
          <Link href="/dashboard">
            <a className="app__buttons">Change it</a>
          </Link>
        </div>

        {/* Post Title */}
        {/* <div className="py-2">
          <input type="text" />
        </div> */}
        {/* Post Content */}
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={e => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-sm text-white rounded-lg p-2"
          ></textarea>
          <p
            className={`my-4 font-medium text-sm text-cyan-600 ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          disabled={disabled}
          type="submit"
          className={`app__buttons w-full ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
