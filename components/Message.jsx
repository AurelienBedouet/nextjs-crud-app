import React from "react";
import Image from "next/image";

const Message = ({
  children,
  avatar,
  username,
  title,
  featuredImage,
  postContent,
}) => {
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
      {featuredImage ? (
        <Image
          src={featuredImage}
          alt={`${title}'s featured image'`}
          width={500}
          height={333}
        />
      ) : null}
      <div className="pt-4">
        <p>{title}</p>
        <div dangerouslySetInnerHTML={{ __html: postContent }} />
      </div>
      {children}
    </div>
  );
};

export default Message;
