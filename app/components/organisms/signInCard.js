"use client";

import { useUserAuth } from "../../_utils/auth-context";
import Link from "next/link";
import Image from "next/image";

export default function SignInCard() {
    const { user, googleSignIn, firebaseSignOut, loading } = useUserAuth();

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

    if (loading) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    return (
        user ? (
            <div className="card bg-base-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-md">
                <div className="card-body">
                    <figure>
                        <div className="avatar">
                            <div className="w-20 rounded-md m-2">
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
                                className="btn btn-primary btn-wide rounded-md"
                                href="/pages/shopping-list"
                                aria-label="Continue to my shopping list"
                            >
                                Shopping List
                            </Link>
                            <Link
                                className="btn btn-primary btn-wide rounded-md"
                                href="/pages/quick-add"
                                aria-label="Edit quick adds"
                            >
                                Edit Quick Adds
                            </Link>

                            <button
                                aria-label="Sign Out"
                                onClick={handleSignOut}
                                className="btn btn-primary btn-wide rounded-md"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="hero-content bg-base-100 rounded-md text-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">Hello</h1>
                    <p className="mb-5">
                        Welcome to Bastet Grocer! We store your grocery list so you can
                        access it from anywhere. Please sign in with Google to get
                        started:
                    </p>
                    <button
                        aria-label="Sign In with Google"
                        onClick={handleSignIn}
                        className="btn btn-primary btn-wide rounded-md"
                    >
                        Sign In with Google
                    </button>
                </div>
            </div>
        )
    );

}