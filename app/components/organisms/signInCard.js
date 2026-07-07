"use client";

import { useUserAuth } from "@/app/_utils/auth-context";

import Link from "next/link";

import { getDisplayName, UserAvatar } from "@/app/_utils/userInfo";
import { CartIcon, ArrowRightIcon, QuickAddIcon, SignOutIcon, GoogleIcon } from "../atoms/icons";
import { SignInSkeleton } from "../atoms/skeletons";


export default function SignInCard() {
    const { user, googleSignIn, firebaseSignOut, loading } = useUserAuth();

    async function handleSignIn() {
        try {
            await googleSignIn();
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSignOut() {
        try {
            await firebaseSignOut();
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <SignInSkeleton />;
    }

    if (user) {
        const displayName = getDisplayName(user);

        return (
            <section className="card w-full max-w-md border border-base-300 bg-base-100">
                <div className="card-body items-center gap-4 text-center">
                    <UserAvatar user={user} />
                    <h1 className="wrap-break-word text-3xl sm:text-4xl font-bold">
                        Welcome back, {displayName}
                    </h1>

                    <p className="text-sm text-base-content/70">
                        Your grocery list is saved and ready whenever you are.
                    </p>
                    <div className="grid w-full gap-3">
                        <Link
                            className="btn btn-primary justify-between h-auto px-4 py-2"
                            href="/shopping-list"
                            aria-label="Continue to my shopping list"
                        >
                            <span className="inline-flex items-center gap-2">
                                <CartIcon />
                                Shopping List
                            </span>
                            <span aria-hidden="true"><ArrowRightIcon /></span>
                        </Link>

                        <Link
                            className="btn btn-accent justify-between h-auto px-4 py-2"
                            href="/quick-add"
                            aria-label="Edit quick adds"
                        >
                            <span className="inline-flex items-center gap-2">
                                <QuickAddIcon />
                                Quick Adds
                            </span>
                            <span aria-hidden="true"><ArrowRightIcon /></span>
                        </Link>

                        <div className="divider my-0">or</div>

                        <button
                            type="button"
                            aria-label="Sign out"
                            onClick={handleSignOut}
                            className="btn btn-outline h-auto px-4 py-2"
                        >
                            <SignOutIcon />
                            Sign Out
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="card w-full max-w-md border border-base-300 bg-base-100">
            <div className="card-body gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                            Bastet Grocer
                        </h1>

                        <h2 className="text-lg sm:text-2xl font-semibold">
                            Your groceries, saved simply.
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base text-base-content/75">
                        Sign in to keep your grocery list synced across your devices.
                    </p>
                </div>

                <button
                    type="button"
                    aria-label="Sign in with Google"
                    onClick={handleSignIn}
                    className="btn btn-primary btn-lg h-auto px-4 py-2"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>

                <p className="text-center text-xs text-base-content/75">
                    No account setup needed. Your list is tied to your Google sign-in.
                </p>
            </div>
        </section>
    );
}