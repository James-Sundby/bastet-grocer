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
    <main className="flex flex-1 flex-col items-center justify-center" role="main">
      {user ? (
        <div className="relative h-custom w-full">
          {/* <Image
            src="/grocery.webp"
            alt="Grocery background"
            fill={true}
            priority={true}
            style={{ objectFit: "cover" }}
          /> */}
          <div className="absolute inset-0 bg-black/75"></div>
          <div className="card bg-base-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border">
            <div className="card-body">
              <figure>
                <div className="avatar">
                  <div className="w-20 rounded-xl m-2">
                    <Image
                      src={user.photoURL}
                      alt="user avatar"
                      width={80}
                      height={80}
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
                    href="/pages/quick-add"
                    aria-label="Edit quick adds"
                  >
                    Edit Quick Adds
                  </Link>
                  <Link
                    className="btn btn-primary btn-wide"
                    href="/pages/shopping-list"
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
          <div className="text-center text-gray-400 absolute bottom-2 w-full">
            <p>
              Photo by{" "}
              <a
                href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                className="underline"
              >
                Scott Warman
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                className="underline"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative h-custom w-full">
          {/* <Image
            src="/grocery.webp"
            alt="Grocery background"
            fill={true}
            priority={true}
            style={{ objectFit: "cover" }}
          /> */}
          <div className="absolute inset-0 bg-black/75"></div>
          <div className="hero-content text-white text-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5">
                Welcome to Bastet Grocer! We store your grocery list so you can
                access it from anywhere. Please sign in with Google to get
                started:
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
          <div className="text-center text-gray-400 absolute bottom-2 w-full">
            <p>
              Photo by{" "}
              <a
                href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                className="underline"
              >
                Scott Warman
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                className="underline"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
