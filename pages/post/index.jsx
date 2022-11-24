import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../utils/firebase";
import { featuredImageOptions } from "../../utils/data";
import { validateWebsiteUrl } from "../../utils/helpers";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import QuillToolbar, { modules, formats } from "../../components/EditorToolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 } from "uuid";
import TabContent from "../../components/TabComponent/TabContent";
import UnsplashImages from "../../components/unsplashImages";
import Image from "next/image";

const Post = () => {
  // Form State
  const [post, setPost] = useState({
    title: "",
    postContent: "",
    featuredImageUrl: "",
  });

  const [uploadImage, setUploadImage] = useState("");

  const [linkImage, setLinkImage] = useState({
    websiteUrl: "",
    isValid: false,
  });

  const [showImgSelectionOptions, setShowImgSelectionOptions] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const [user, loading] = useAuthState(auth);

  const route = useRouter();
  const routeData = route.query;

  // Tab
  const [currentTab, setCurrentTab] = useState("1");
  const handleTabClick = e => {
    e.preventDefault();
    setCurrentTab(e.target.id);
  };

  const onPostContentChange = value => {
    setPost({ ...post, postContent: value });
  };

  // Upload Image solution
  const onUploadImage = e => {
    setUploadImage(e.target.files[0]);
    setShowImgSelectionOptions(false);
  };

  const submitUploadImage = () => {
    if (!uploadImage) return;
    else {
      const imageID = v4();
      const imageRef = ref(
        storage,
        `images/featuredImages/${uploadImage.name + imageID}`
      );

      uploadBytes(imageRef, uploadImage).then(snapshot => {
        getDownloadURL(snapshot.ref).then(url =>
          setPost({ ...post, featuredImageUrl: url })
        );
      });
    }
  };

  useEffect(() => {
    submitUploadImage();
  }, [uploadImage]);

  // Link Image Solution
  const onChangeLinkImage = e => {
    const { value } = e.target;
    const isValid = !value || validateWebsiteUrl(value);

    setLinkImage({
      websiteUrl: value,
      isValid,
    });
  };

  const submitLinkImage = () => {
    if (!linkImage.websiteUrl) return;

    setPost({ ...post, featuredImageUrl: linkImage.websiteUrl });
    setShowImgSelectionOptions(false);
  };

  // Submit Post
  const submitPost = async e => {
    e.preventDefault();

    // Featured Image
    if (!post.featuredImageUrl) {
      toast.error("No featured image selected 😢");
      disableButton();
      return;
    }

    // Title and Post Content - Run Checks
    if (!post.title) {
      toast.error("A title is required 😅");
      disableButton();
      return;
    }

    if (post.title.length > 100) {
      toast.error("Title must be 100 characters max 😅");
      disableButton();
      return;
    }

    if (post.title.length > 100) {
      toast.error("Title must be 100 characters max 😅");
      disableButton();
      return;
    }

    if (!post.postContent) {
      toast.error("Post Content Field is empty 😅");
      disableButton();
      return;
    }

    // Update post
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = {
        ...post,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        createdAt: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL || "/hacker.png",
        username: user.displayName || "anon",
      });
      setPost({ title: "", postContent: "" });
      toast.success("Post successfully published! 🚀 ");
      return route.push("/");
    }
  };

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/signin");
    if (routeData.id) {
      setPost({
        title: routeData.title,
        postContent: routeData.postContent,
        featuredImageUrl: routeData.featuredImageUrl,
        id: routeData.id,
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  const disableButton = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  return (
    <div className="my-20 p-4 md:p-6 lg:p-12 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {post.hasOwnProperty("id") ? "Edit your Post" : "Create a new Post"}
      </h1>
      <div className="py-4 flex items-center gap-6">
        <p>
          Your username:{" "}
          <span className="ml-2 font-medium">{user?.displayName}</span>
        </p>
        <Link href="/dashboard">
          <a className="app__buttons">Change it</a>
        </Link>
      </div>

      {/* Post Form */}
      <form onSubmit={submitPost}>
        {/* Post Title */}
        <div className="py-4 flex items-center gap-4">
          <label htmlFor="title" className="text-lg font-medium py-2">
            Title
          </label>
          <input
            value={post.title}
            onChange={e => setPost({ ...post, title: e.target.value })}
            id="title"
            name="title"
            type="text"
            className="border-2 w-full rounded-lg py-1 px-2 focus:border-cyan-500"
          />
          <p
            className={`my-4 font-medium text-sm text-cyan-600 ${
              post.title.length > 100 ? "text-red-600" : ""
            }`}
          >
            {post.title.length}/100
          </p>
        </div>

        {/* Post Featured Image */}
        <div className="flex items-center gap-6">
          <h3 className="text-lg font-medium">Featured Image</h3>

          {/* Open Modal Featured Image Selection Options */}
          <button
            onClick={() => setShowImgSelectionOptions(true)}
            className="app__buttons"
            type="button"
          >
            Select
          </button>

          {/* Modal Featured Image Selection Options */}
          {showImgSelectionOptions ? (
            <>
              <div
                onClick={() => setShowImgSelectionOptions(false)}
                className="absolute top-0 right-0 w-screen h-screen backdrop-blur-sm z-10"
              />

              {/* Tab Component */}
              <div className="fixed top-[50%] left-[50%] transform translate-y-[-50%] translate-x-[-50%] w-[90%] max-w-3xl max-h-fit shadow-xl rounded-xl bg-white p-4 sm:p-8 md:p-12 z-20">
                {/* Tabs Buttons */}
                <div className="flex justify-between">
                  {featuredImageOptions.map(tab => (
                    <button
                      className="text-base font-medium border border-gray-500 cursor-pointer p-2 w-full transition ease-out duration-500 hover:text-white hover:bg-cyan-500 disabled:text-white disabled:bg-gray-500 disabled:cursor-default"
                      key={tab.id}
                      id={tab.id}
                      disabled={currentTab === `${tab.id}`}
                      onClick={handleTabClick}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* Tabs Content */}
                <div>
                  <TabContent id="1" currentTab={currentTab}>
                    <div className="pt-10 flex flex-col items-center gap-6">
                      <label
                        htmlFor="imageUpload"
                        className="app__buttons cursor-pointer text-center w-[80%]"
                      >
                        Upload Image
                      </label>
                      <input
                        type="file"
                        onChange={onUploadImage}
                        id="imageUpload"
                        accept="image/png, image/jpeg"
                        className="hidden"
                      />
                      <p>Accepted format: PNG or JPEG</p>
                    </div>
                  </TabContent>
                  <TabContent id="2" currentTab={currentTab}>
                    <div className="pt-10 flex flex-col items-center gap-6">
                      <input
                        type="text"
                        value={linkImage.websiteUrl}
                        name={linkImage.websiteUrl}
                        onChange={onChangeLinkImage}
                        placeholder="https://my-image.com"
                        className="w-[80%] border-2 rounded-lg py-1 px-2"
                      />
                      {!linkImage.isValid &&
                        linkImage.websiteUrl.length > 0 && (
                          <div className="text-red-600">URL is invalid</div>
                        )}
                      <button
                        onClick={submitLinkImage}
                        disabled={!linkImage.isValid}
                        className={`app__buttons w-[80%] ${
                          !linkImage.isValid
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Submit
                      </button>
                    </div>
                  </TabContent>
                  <TabContent id="3" currentTab={currentTab}>
                    <UnsplashImages
                      post={post}
                      setPost={setPost}
                      setShowImgSelectionOptions={setShowImgSelectionOptions}
                    />
                  </TabContent>
                </div>
              </div>
            </>
          ) : null}
          {!post.featuredImageUrl ? (
            <p className="text-red-500">No images selected yet.</p>
          ) : (
            <Image
              src={post.featuredImageUrl}
              alt="image"
              width={100}
              height={66}
              className="rounded-lg"
            />
          )}
        </div>

        {/* Post Content */}
        <div className="py-4">
          <QuillToolbar toolbarId={"t1"} />
          <ReactQuill
            theme="snow"
            value={post.postContent}
            onChange={onPostContentChange}
            placeholder="Write something awesome..."
            modules={modules("t1")}
            formats={formats}
          />
        </div>
        <button
          disabled={disabled}
          type="submit"
          className={`app__buttons w-full mt-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
