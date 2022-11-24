import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
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
import UserInfo from "./UserInfo";
import Image from "next/image";
import moment from "moment/moment";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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
        <div
          onClick={() => setShowDeletePopup(false)}
          className="absolute top-0 right-0 w-screen h-screen bg-gray-500/50 backdrop-blur-sm z-10"
        ></div>
        <div className="fixed top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%] w-[90%] max-w-sm shadow-xl rounded-xl bg-white p-4 sm:p-8 md:p-12 z-20">
          <h2 className="text-center text-lg font-medium">
            Are you sure you want to delete this Post ?
          </h2>
          <div className="flex items-center justify-around mt-8">
            <button
              onClick={() => deletePost(id)}
              className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm hover:opacity-80"
            >
              <FaTrashAlt className="text-2xl" /> Delete
            </button>
            <button
              onClick={() => setShowDeletePopup(false)}
              className="flex items-center justify-center gap-2 py-2 text-sm hover:opacity-80"
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
            const { id, createdAt, updatedAt, title, featuredImageUrl } = post;
            return (
              <article key={id} {...post} className="py-8">
                <div>
                  <h2>{title}</h2>
                  <p>
                    Last update:{" "}
                    {moment(updatedAt?.seconds * 1000).format("DD MMM YYYY") ||
                      moment(createdAt.seconds * 1000).format("DD MMM YYYY")}
                  </p>
                  {featuredImageUrl ? (
                    <Image
                      src={featuredImageUrl}
                      alt={title}
                      width={500}
                      height={333}
                    />
                  ) : null}
                </div>
                <div className="flex gap-8">
                  <Link href={{ pathname: `/${id}`, query: { ...post } }}>
                    <button className="app__buttons">See Post</button>
                  </Link>
                  {/* Redirects user to Post Page with prefilled data (query) */}
                  <Link href={{ pathname: "/post", query: post }}>
                    <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                      <AiFillEdit className="text-2xl" /> Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => setShowDeletePopup(true)}
                    className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    <FaTrashAlt className="text-2xl" /> Delete
                  </button>

                  {showDeletePopup ? <DeletePopup id={id} /> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
