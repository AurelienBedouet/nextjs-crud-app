import React from "react";
import Image from "next/image";

const Message = ({ children, avatar, username, description }) => {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-4">
        <Image
          src={avatar || "/hacker.png"}
          alt={username || "anon"}
          width={48}
          height={48}
          className="rounded-full"
        />
        <h2>{username || "anon"}</h2>
      </div>
      <div className="pt-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Message;
