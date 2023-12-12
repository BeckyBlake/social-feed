import Message from "@/components/message";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Home() {
  // create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  // get all posts
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div
      className="my-12 text-lg font-medium"
      style={{ marginLeft: "1rem", marginRight: "1rem" }}
    >
      <h2>See what other people are saying</h2>
      {/* <Message /> */}
      {allPosts.map((post) => (
        <Message {...post} key={post.id}></Message>
      ))}
    </div>
  );
}
