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
            <span className="loading loading-spinner text-primary loading-xl"></span>
        );
    }

    return (
        user ? (
            <div className="card bg-base-100 rounded-md max-w-sm m-4">
                <div className="card-body gap-4">
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
                    <h2 className="card-title text-2xl justify-center">
                        Welcome, {user.displayName ? user.displayName : user.email ? user.email : "User"}
                    </h2>
                    <div className="flex flex-col gap-4">
                        <Link
                            className="btn btn-primary rounded-md"
                            href="/pages/shopping-list"
                            aria-label="Continue to my shopping list"
                        >
                            Shopping List
                        </Link>
                        <Link
                            className="btn btn-primary rounded-md"
                            href="/pages/quick-add"
                            aria-label="Edit quick adds"
                        >
                            Edit Quick Adds
                        </Link>

                        <button
                            aria-label="Sign Out"
                            onClick={handleSignOut}
                            className="btn btn-primary rounded-md"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="card bg-base-100 rounded-md max-w-sm m-4">
                <div className="card-body gap-4">
                    <h1 className="card-title justify-center text-5xl">Hello</h1>
                    <p className="text-base">
                        Welcome to Bastet Grocer! We store your grocery list so you can
                        access it from anywhere. Please sign in with Google to get
                        started:
                    </p>
                    <button
                        aria-label="Sign In with Google"
                        onClick={handleSignIn}
                        className="btn btn-primary rounded-md h-auto py-2"
                    >
                        Sign In with Google
                    </button>
                </div>
            </div>
        )
    );

}