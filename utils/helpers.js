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