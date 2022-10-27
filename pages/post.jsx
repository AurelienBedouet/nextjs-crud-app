import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
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
import QuillToolbar, { modules, formats } from "../components/EditorToolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Post = () => {
  // Form State
  const [post, setPost] = useState({ title: "", postContent: "" });

  const [user, loading] = useAuthState(auth);
  const [disabled, setDisabled] = useState(false);
  const route = useRouter();
  const routeData = route.query;

  const handleChange = value => {
    setPost({ ...post, postContent: value });
  };

  // Submit Post
  const submitPost = async e => {
    e.preventDefault();

    // Run Checks
    if (!post.title) {
      toast.error("A title is required 😅");
      disableButton();
      return;
    }

    if (post.title.length > 100) {
      toast.error("Title must be 100 characters max 😅");
      disableButton();
      return;
    }

    if (!post.postContent) {
      toast.error("Post Content Field is empty 😅");
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
      setPost({ title: "", postContent: "" });
      toast.success("Post successfully published! 🚀 ");
      return route.push("/");
    }
  };

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/signin");
    if (routeData.id) {
      setPost({
        title: routeData.title,
        postContent: routeData.postContent,
        id: routeData.id,
      });
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

      {/* Post Form */}
      <form onSubmit={submitPost}>
        {/* Post Title */}
        <div className="my-8 flex items-center gap-4">
          <h3 className="text-lg font-medium py-2">Title</h3>
          <input
            value={post.title}
            onChange={e => setPost({ ...post, title: e.target.value })}
            type="text"
            className="border-2 w-full rounded-lg p-2 focus:border-cyan-500"
            required
          />
          <p
            className={`my-4 font-medium text-sm text-cyan-600 ${
              post.title.length > 100 ? "text-red-600" : ""
            }`}
          >
            {post.title.length}/100
          </p>
        </div>

        {/* Post Content */}
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Post Content</h3>
          {/* <textarea
            value={post.description}
            onChange={e => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-sm text-white rounded-lg p-2"
          ></textarea> */}
          <QuillToolbar toolbarId={"t1"} />
          <ReactQuill
            theme="snow"
            value={post.postContent}
            onChange={handleChange}
            placeholder="Write something awesome..."
            modules={modules("t1")}
            formats={formats}
          />
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
