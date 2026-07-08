"use client";

import { Show, OrganizationSwitcher, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";


export default function NavBar() {
    return (
        <header className="navbar border-b border-base-300 bg-base-100 shadow" role="banner">
            <nav className="flex-1" aria-label="Main navigation">
                <Link
                    href="/"
                    className="btn btn-ghost h-auto px-3 py-2 text-xl font-bold text-primary"
                    aria-label="Go to Bastet Grocer home page"
                    title="Go to Bastet Grocer home page"
                    prefetch={false}
                >
                    Bastet Grocer
                </Link>
            </nav>

            <div className="navbar-end gap-2">
                <Show when="signed-in">
                    <OrganizationSwitcher
                        hidePersonal
                        afterCreateOrganizationUrl="/shopping-list"
                        afterSelectOrganizationUrl="/shopping-list"
                    />
                    <UserButton />
                </Show>

                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button className="btn btn-primary h-auto px-4 py-2">
                            Sign In
                        </button>
                    </SignInButton>
                </Show>
            </div>
        </header>
    );
}