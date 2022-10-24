import Image from "next/image";
import React from "react";

const Message = ({ children, avatar, username, description }) => {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={`${username}'s profile picture`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <h2>{username}</h2>
      </div>
      <div className="pt-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Message;
