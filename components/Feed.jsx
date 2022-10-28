import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Message from "./Message";

const Feed = () => {
  // Create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  console.log(allPosts[0]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="my-12 text-lg font-medium">
      <h2 className="text-2xl">See what other people are saying</h2>
      {allPosts.map(post => (
        <Message key={post.id} {...post}>
          <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
            <button
              className={
                post.comments?.length > 0
                  ? "bg-green-600 py-2 px-3 text-sm font-normal text-white"
                  : "bg-red-400 py-2 px-3 text-sm font-normal text-white"
              }
            >{`${post.comments ? post.comments.length : 0} Comments`}</button>
          </Link>
        </Message>
      ))}
    </div>
  );
};

export default Feed;
