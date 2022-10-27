import React, {useState, useEffect} from "react";
import Message from "../components/Message";
import {useRouter} from "next/router";
import {auth, db} from "../utils/firebase";
import {toast} from "react-toastify";
import {arrayUnion, doc, onSnapshot, Timestamp, updateDoc} from "firebase/firestore";
import Image from "next/image";
import {useAuthState} from "react-firebase-hooks/auth";

const PostDetails = () => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  // Submit a Comment
  const submitComment = async () => {
    // Check if the user is logged in
    if (!user) return route.push("/auth/signin");

    if (!comment) {
      toast.error("Don't leave an empty message 😁");
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        avatar: user.photoURL || "/hacker.png",
        userName: user.displayName || "anonymous",
        time: Timestamp.now()
      })
    });

    setComment("");
  };

  // Get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, snapshot => {
      setAllComments(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={e => setComment(e.target.value)}
            type="text"
            value={comment}
            placeholder="Send a comment"
            className="bg-gray-700 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitComment}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit</button>
        </div>

        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allComments?.map((comm, i) => (
            <div key={i}>
              <div>
                <Image
                  src={comm.avatar || "/hacker.png"}
                  alt={comm.displayName || "anonymous"}
                  width={48}
                  height={48}
                  className="rounded-full cursor-pointer"
                />
                <h2>{comm.userName || "anonymous"}</h2>
              </div>
              <p>{comm.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;