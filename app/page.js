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
    <main className="flex flex-1 flex-col items-center">
      {user ? (
        <>
          <div className="card card-compact bg-base-100">
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
            <div className="card-body">

              <h2 className="card-title text-2xl justify-center">
                Welcome, {user.displayName ? user.displayName : user.email ? user.email : "User"}
              </h2>

              <div className="card-actions justify-center">
                <button
                  aria-label="Sign Out"
                  onClick={handleSignOut}
                  className="btn btn-primary btn-wide"
                >
                  Sign Out
                </button>
                <Link
                  className="btn btn-primary btn-wide"
                  href="/shopping-list"
                  aria-label="Continue to my shopping list"
                >
                  Shopping List
                </Link>
              </div>
            </div>
          </div>

        </>
      ) : (
        <div
          className="hero h-svh"
          style={{
            backgroundImage: "url(/wheat.webp)",
          }}
        >
          <div className="hero-overlay bg-opacity-75 bg-black"></div>
          <div className="hero-content text-white text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5">
                Welcome to Bastet Grocer! We store your grocery list so you can access it from anywhere. Please use one of our sign-in partners to get started:
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
        </div>
      )}
    </main>
  );
}
