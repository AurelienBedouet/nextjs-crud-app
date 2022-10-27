import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import UserInfo from "../components/UserInfo";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  console.log(user);

  // See if user is logged
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/signin");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  // Delete Post
  const deletePost = async id => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  const DeletePopup = ({ id }) => {
    return (
      <>
        <div className="absolute top-0 right-0 w-screen h-screen bg-gray-500/50 backdrop-blur-sm z-10"></div>
        <div className="fixed top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%] w-[90%] max-w-sm shadow-xl rounded-xl bg-white p-4 sm:p-8 md:p-12 z-20">
          <h2 className="text-center text-lg font-medium">
            Are you sure you want to delete this Post ?
          </h2>
          <div className="flex items-center justify-around mt-8">
            <button
              onClick={() => deletePost(id)}
              className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
            >
              <FaTrashAlt className="text-2xl" /> Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="flex items-center justify-center gap-2 py-2 text-sm"
            >
              <FaTimes className="text-2xl" /> Close
            </button>
          </div>
        </div>
      </>
    );
  };

  // Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <UserInfo />

      {/* User Posts */}
      <div className="mt-16">
        <h1>
          Your Posts{" "}
          <span className="ml-2 circle">
            {posts.length > 0 ? posts.length : 0}
          </span>
        </h1>
        <div>
          {posts.map(post => {
            return (
              <Message key={post.id} {...post}>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeletePopup(true)}
                    className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    <FaTrashAlt className="text-2xl" /> Delete
                  </button>

                  {showDeletePopup ? <DeletePopup id={post.id} /> : null}

                  {/* Redirects user to Post Page with prefilled data (query) */}
                  <Link href={{ pathname: "/post", query: post }}>
                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                      <AiFillEdit className="text-2xl" /> Edit
                    </button>
                  </Link>
                </div>
              </Message>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
