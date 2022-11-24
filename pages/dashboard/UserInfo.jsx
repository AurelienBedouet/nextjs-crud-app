import React, { useEffect, useState } from "react";
import { GoCalendar } from "react-icons/go";
import Image from "next/image";
import moment from "moment/moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { updateProfile } from "firebase/auth";

const UserInfo = () => {
  const [user, loading] = useAuthState(auth);
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  let usernameMessage = "";
  if (!isValid && formValue.length > 3) {
    usernameMessage = "Incorrect Format.";
  } else if (formValue.length < 4) {
    usernameMessage = "Username must be 4 characters minimum.";
  } else usernameMessage = "Correct Format.";

  const changeUsername = async e => {
    e.preventDefault();

    try {
      await updateProfile(auth.currentUser, { displayName: formValue });
      console.log("Profile updated!");
      setFormValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = e => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length > 3 && re.test(val)) {
      console.log("Username too short");
      setFormValue(val);
      setIsValid(true);
    } else {
      setFormValue(val);
      setIsValid(false);
      console.log("Incorrect username");
    }
  };

  useEffect(() => {}, [user]);

  return (
    <div>
      {/* User Info */}
      <div className="rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={user?.photoURL || "/hacker.png"}
              alt={user?.displayName || "anon"}
              width={48}
              height={48}
              className="rounded-full"
            />
            <p>{user?.displayName || "anon"}</p>
          </div>
          <p className="flex items-center gap-4">
            <GoCalendar size={24} /> Joined in{" "}
            {moment(user?.metadata.creationTime).format("MMM YYYY")}
          </p>
        </div>

        {/* Change username */}
        <div className="mt-8">
          <div className="flex items-center gap-4">
            <h3>Change Username</h3>
            <form onSubmit={changeUsername}>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="newUsername"
                  value={formValue}
                  onChange={onChange}
                  className="border-2 rounded-l-lg p-2 focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="bg-cyan-500 text-white border-2 border-l-0 rounded-r-lg px-5 py-2"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
          <p className={`pt-4 ${isValid ? "text-green-500" : "text-red-500"}`}>
            {usernameMessage}
          </p>
        </div>
      </div>

      {/* User Bio */}
      <div className="rounded-lg shadow-xl p-6">
        <h3>Bio</h3>
        <p></p>
      </div>
    </div>
  );
};

export default UserInfo;
