import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, query, where } from "firebase/firestore";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  // see if user is logged in
  const getData = async () => {
    if (loading) return;
    if (!user) {
      return route.push("/auth/login");
    }

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = await onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //   get user's data
  useEffect(() => {
    getData();
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
      <h1>Your posts</h1>
      <div>posts</div>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}
