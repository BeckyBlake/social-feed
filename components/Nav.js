import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <div>
      <nav
        className="flex justify-between items-center py-10"
        style={{ marginLeft: "1rem", marginRight: "1rem" }}
      >
        <Link href="/">
          <button className="text-lg font-medium"> Creative Minds</button>
        </Link>
        <ul className="flex items-center gap-10">
          {!user && (
            <Link href={"/auth/login"} legacyBehavior>
              <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8 mr-8">
                Join Now
              </a>
            </Link>
          )}
          {user && !loading && (
            <div className="flex items-center gap-6">
              <Link href={"/post"}>
                <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-mg text-sm">
                  Post
                </button>
              </Link>
              <Link href={"/dashboard"}>
                <img
                  className="w-12 rounded-full cursor-pointer hover:shadow-lg  mr-4"
                  src={user.photoURL}
                  alt="user"
                />
              </Link>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}
