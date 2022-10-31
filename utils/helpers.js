import {auth} from "../utils/firebase";
import {updateProfile} from "firebase/auth";
import {uniqueNamesGenerator, animals, adjectives, NumberDictionary} from "unique-names-generator";

// Create random username
const numberDictionary = NumberDictionary.generate({min: 100, max: 999});
const randomName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, numberDictionary],
  separator: "",
  style: "capital"
});

// Add new random username to user's object on first login/sign up
export const addRandomUsername = async () => {
  try {
    await updateProfile(auth.currentUser, {displayName: randomName});
    console.log("Profile updated!");
  } catch (error) {
    console.log(error);
  }
};

// Regular expression pattern for URL - checks if url is valid
export const validateWebsiteUrl = websiteUrl => {
  const urlRegEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
  return urlRegEx.test(String(websiteUrl).toLowerCase());
};