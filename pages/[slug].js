import React, {useState, useEffect} from "react";
import Message from "../components/Message";
import {useRouter} from "next/router";
import {auth, db} from "../utils/firebase";
import {toast} from "react-toastify";
import {arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc} from "firebase/firestore";
import Image from "next/image";

const Details = () => {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    // Check if the user is logged in
    if (!auth.currentUser) return route.push("/auth/login");

    if (!message) {
      toast.error("Don't leave an empty message 😁");
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now()
      })
    });

    setMessage("");
  };

  // Get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, snapshot => {
      setAllMessages(snapshot.data().comments);
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
            onChange={e => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Send a message"
            className="bg-gray-700 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit</button>
        </div>

        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessages?.map((message, i) => (
            <div key={i}>
              <div>
                <Image
                  src={message.avatar}
                  alt={message.displayName}
                  width={48}
                  height={48}
                  className="rounded-full cursor-pointer"
                />
                <h2>{message.userName}</h2>
              </div>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;