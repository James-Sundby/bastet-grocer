"use client";

import Link from "next/link";
import {
    OrganizationSwitcher,
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

export default function NavBar() {
    return (
        <header
            className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow backdrop-blur"
            role="banner"
        >
            <nav
                className="navbar mx-auto w-full max-w-6xl px-3 py-2 md:px-8"
                aria-label="Main navigation"
            >
                <div className="navbar-start">
                    <Link
                        href="/"
                        className="btn btn-ghost h-auto px-2 py-2 text-lg font-black text-primary sm:px-3 sm:text-xl"
                        aria-label="Go to Bastet Grocer home page"
                        title="Go to Bastet Grocer home page"
                        prefetch={false}
                    >
                        Bastet Grocer
                    </Link>
                </div>

                <div className="navbar-end gap-2">
                    <Show when="signed-in">
                        <div className="hidden items-center gap-2 md:flex">
                            <OrganizationSwitcher
                                hidePersonal
                                afterCreateOrganizationUrl="/shopping-list"
                                afterSelectOrganizationUrl="/shopping-list"
                            />

                            <UserButton />
                        </div>

                        <div className="flex items-center md:hidden">
                            <UserButton />
                        </div>
                    </Show>

                    <Show when="signed-out">
                        <div className="flex items-center gap-2">
                            <SignInButton mode="modal" forceRedirectUrl="/shopping-list">
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm sm:btn-md"
                                >
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton mode="modal" forceRedirectUrl="/shopping-list">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm sm:btn-md"
                                >
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>
                </div>
            </nav>

            <Show when="signed-in">
                <div className="border-t border-base-300 px-4 py-2 md:hidden">
                    <div className="mx-auto flex w-full max-w-6xl justify-center overflow-visible">
                        <OrganizationSwitcher
                            hidePersonal
                            afterCreateOrganizationUrl="/shopping-list"
                            afterSelectOrganizationUrl="/shopping-list"
                        />
                    </div>
                </div>
            </Show>
        </header>
    );
}