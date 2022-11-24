import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createApi } from "unsplash-js";

const api = createApi({
  accessKey: "_5yq6oOnnnaK-TD31h5VfBcFg6uXQvhV--c3N1pucdc",
});

const UnsplashImages = ({ post, setPost, setShowImgSelectionOptions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imagesData, setImagesData] = useState(null);

  const selectImage = url => {
    setPost({ ...post, featuredImageUrl: url });
    setShowImgSelectionOptions(false);
  };

  useEffect(() => {
    api.search
      .getPhotos({
        query: searchTerm,
        orientation: "landscape",
        page: 1,
        perPage: 16,
      })
      .then(result => setImagesData(result))
      .catch(() => console.log("something went wrong!"));
  }, [searchTerm]);

  if (imagesData === null) {
    return <div>Loading...</div>;
  } else if (imagesData?.errors) {
    return (
      <div>
        <div>{imagesData?.errors[0]}</div>
        <div>PS: Make sure to set your access token!</div>
      </div>
    );
  } else {
    return (
      <div className="pt-10 flex flex-col items-center gap-6">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for an image..."
          className="border-2 rounded-lg py-1 px-2 w-[80%] mx-auto"
        />

        <div className="flex flex-wrap gap-2">
          {imagesData?.response?.results?.map(
            ({ id, user, urls, alt_description }) => (
              <article key={id}>
                <Image
                  onClick={() => selectImage(urls.regular)}
                  className="rounded-lg cursor-pointer hover:opacity-80"
                  src={urls.thumb}
                  alt={alt_description || "image from unsplash.com"}
                  width={150}
                  height={100}
                />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-500 font-light text-sm no-underline">
                    by
                  </span>
                  <a
                    className="block text-gray-500 font-light text-sm underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://unsplash.com/@${user.username}`}
                  >
                    {user.name.slice(0, 14)}
                    {user.name.length > 14 ? "..." : ""}
                  </a>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    );
  }
};

export default UnsplashImages;
