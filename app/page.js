"use client";

import { useUserAuth } from "./_utils/auth-context";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { user, googleSignIn, firebaseSignOut } = useUserAuth();

  async function handleSignIn() {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignOut() {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center ">
      {user ? (
        <>
          <div
            className="hero h-custom"
            style={{
              backgroundImage: "url(/grocery.webp)",
            }}
          >
            <div className="hero-overlay bg-opacity-75 bg-black"></div>
            <div className="card bg-base-100 -translate-y-16 border">
              <div className="card-body">
                <figure>
                  <div className="avatar">
                    <div className="w-24 mask mask-squircle m-2">
                      <Image
                        src={user.photoURL}
                        alt="user avatar"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                </figure>
                <h2 className="card-title text-2xl justify-center mb-4">
                  Welcome, {user.displayName ? user.displayName : user.email ? user.email : "User"}
                </h2>

                <div className="card-actions justify-center">
                  <div className="flex flex-col gap-4">
                    <Link
                      className="btn btn-primary btn-wide"
                      href="/quick-add"
                      aria-label="Continue to my shopping list"
                    >
                      Edit Quick Adds
                    </Link>
                    <Link
                      className="btn btn-primary btn-wide"
                      href="/shopping-list"
                      aria-label="Continue to my shopping list"
                    >
                      Shopping List
                    </Link>
                    <button
                      aria-label="Sign Out"
                      onClick={handleSignOut}
                      className="btn btn-primary btn-wide"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-400 mt-auto pb-2">
              <p>
                Photo by <a href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" className="underline">Scott Warman</a> on
                <a href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" className="underline"> Unsplash</a>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="hero h-custom"
            style={{
              backgroundImage: "url(/grocery.webp)",
            }}
          >
            <div className="hero-overlay bg-opacity-75 bg-black"></div>
            <div className="hero-content text-white text-center flex-col">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                {/* <p className="mb-5">
                  Welcome to Bastet Grocer! We store your grocery list so you can access it from anywhere. Please use one of our sign-in partners to get started:
                </p> */}
                <p className="mb-5">
                  Welcome to Bastet Grocer! We store your grocery list so you can access it from anywhere. Please sign in with Google to get started:
                </p>
                <button
                  aria-label="Sign In with Google"
                  onClick={handleSignIn}
                  className="btn btn-wide"
                >
                  Sign In with Google
                </button>
              </div>
            </div>
            <div className="text-center text-gray-400 mt-auto pb-2">
              <p>
                Photo by <a href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" className="underline">Scott Warman</a> on
                <a href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" className="underline"> Unsplash</a>
              </p>
            </div>
          </div>

        </>
      )}

    </main>

  );
}

