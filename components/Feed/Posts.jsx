import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import moment from "moment/moment";

const Posts = () => {
  // Create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="col-span-full lg:col-span-9">
      {allPosts.map(post => {
        const {
          id,
          createdAt,
          featuredImageUrl,
          title,
          username,
          avatar,
          comments,
        } = post;

        console.log(createdAt);

        return (
          <article
            key={id}
            className="p-8 flex items-center justify-between gap-8 rounded-lg shadow-lg mb-6"
          >
            {/* Text */}
            <div>
              <div className="flex items-center gap-4">
                <Image
                  src={avatar || "/hacker.png"}
                  alt={username || "anon"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <p>{username || "anon"}</p>
              </div>
              <Link href={{ pathname: `/posts/${id}`, query: { ...post } }}>
                <h2 className="cursor-pointer text-2xl my-6">{title}</h2>
              </Link>
              <div className="flex items-center gap-6 cursor-default">
                <p>{moment(createdAt.seconds * 1000).format("DD MMM YYYY")}</p>
                <span>(X) likes</span>
                <span
                  className={
                    comments?.length > 0
                      ? "bg-green-600 py-2 px-3 text-sm font-normal text-white"
                      : "bg-red-400 py-2 px-3 text-sm font-normal text-white"
                  }
                >{`${comments ? comments.length : 0} Comments`}</span>
              </div>
            </div>

            {/* Featured Image */}
            <Link href={{ pathname: `/posts/${id}`, query: { ...post } }}>
              {featuredImageUrl ? (
                <Image
                  src={featuredImageUrl}
                  alt={`${title}'s featured image'`}
                  width={300}
                  height={200}
                  className="cursor-pointer rounded-lg"
                />
              ) : null}
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default Posts;
