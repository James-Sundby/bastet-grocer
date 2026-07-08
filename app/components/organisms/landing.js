"use client";

import Image from "next/image";
import { SignUpButton, SignInButton } from "@clerk/nextjs";

export default function Landing() {
    return (
        <main className="flex flex-1 flex-col bg-base-200" role="main">
            <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-12 md:px-8">
                <Image
                    src="/grocery.webp"
                    alt="A row of vegetables displayed at a grocery store."
                    fill
                    priority
                    sizes="100vw"
                    className="-z-10 object-cover brightness-50"
                />

                <div className="w-full max-w-xl rounded-md border border-base-300 bg-base-100/95 p-6 text-center shadow-xl backdrop-blur md:p-8">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                        Bastet Grocer
                    </p>

                    <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                        Groceries, shared simply.
                    </h1>

                    <p className="mt-4 text-base leading-7 text-base-content/75">
                        Build a grocery list, check things off while you shop, save your
                        common items, and keep the household in sync.
                    </p>

                    <div className="mt-6 grid gap-3 text-left text-sm text-base-content/75">
                        <div className="rounded-md border border-base-300 bg-base-200 p-3">
                            <span className="font-bold text-base-content">Shared lists</span>
                            <p>Use Clerk households to keep groceries synced with your partner.</p>
                        </div>

                        <div className="rounded-md border border-base-300 bg-base-200 p-3">
                            <span className="font-bold text-base-content">Quick Adds</span>
                            <p>Save common groceries and add them again without retyping.</p>
                        </div>

                        <div className="rounded-md border border-base-300 bg-base-200 p-3">
                            <span className="font-bold text-base-content">Shopping Mode</span>
                            <p>Use a cleaner, bigger checklist while you are in the store.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <SignUpButton mode="modal">
                            <button className="btn btn-primary h-auto px-4 py-2">
                                Get Started
                            </button>
                        </SignUpButton>

                        <SignInButton mode="modal">
                            <button className="btn btn-outline h-auto px-4 py-2">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>

                    <p className="mt-4 text-xs text-base-content/60">
                        Built for quick grocery trips, shared households, and fewer forgotten
                        items.
                    </p>
                </div>

                <aside className="absolute bottom-2 w-full px-4 text-center text-xs text-neutral-content/80">
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
                </aside>
            </section>
        </main>
    );
}