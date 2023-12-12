import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  // form state
  const [post, setPost] = useState({
    description: "",
  });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const updateData = route.query;

  //   submit post function
  const submitPost = async (e) => {
    e.preventDefault();
    // check if description is empty or too long
    if (!post.description) {
      return toast.error("Please enter a description", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    }
    if (post.description.length > 300) {
      return toast.error("Description too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      // clear out description
      setPost({ description: "" });
      return route.push("/");
    }
  };

  // check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) {
      return route.push("/auth/login");
    }
    if (updateData.id) {
      setPost({ description: updateData.description, id: updateData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading /* eslint-disable-line react-hooks/exhaustive-deps */]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit" : "Create"} Post
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
