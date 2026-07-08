"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    OrganizationSwitcher,
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

const navLinks = [
    { href: "/shopping-list", label: "Shopping List" },
    { href: "/quick-add", label: "Quick Adds" },
];

function MenuIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </svg>
    );
}

function CloseIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M6 6l12 12" />
            <path d="M18 6l-12 12" />
        </svg>
    );
}

function isActive(pathname, href) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const mobileNavRef = useRef(null);
    const mobileButtonRef = useRef(null);

    useEffect(() => {
        function handlePointerDown(event) {
            if (!mobileNavRef.current) {
                return;
            }

            if (!mobileNavRef.current.contains(event.target)) {
                setMobileOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setMobileOpen(false);
                mobileButtonRef.current?.focus();
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown, {
            passive: true,
        });
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    return (
        <header
            className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow backdrop-blur"
            role="banner"
        >
            <nav
                className="navbar mx-auto w-full max-w-6xl px-4 py-2 md:px-8"
                aria-label="Main navigation"
            >
                <div className="navbar-start">
                    <Link
                        href="/"
                        className="btn btn-ghost h-auto px-3 py-2 text-xl font-black text-primary"
                        aria-label="Go to Bastet Grocer home page"
                        title="Go to Bastet Grocer home page"
                        prefetch={false}
                        onClick={closeMobileMenu}
                    >
                        Bastet Grocer
                    </Link>
                </div>

                <Show when="signed-in">
                    <div className="navbar-center hidden md:flex">
                        <ul className="menu menu-horizontal gap-1 px-1 text-sm font-bold">
                            {navLinks.map((link) => {
                                const active = isActive(pathname, link.href);

                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            aria-current={active ? "page" : undefined}
                                            className={
                                                active
                                                    ? "active"
                                                    : "text-base-content/75 hover:text-base-content"
                                            }
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </Show>

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
                    </Show>

                    <Show when="signed-out">
                        <div className="hidden items-center gap-2 md:flex">
                            <SignInButton mode="modal" forceRedirectUrl="/shopping-list">
                                <button
                                    type="button"
                                    className="btn btn-outline h-auto px-4 py-2"
                                >
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton mode="modal" forceRedirectUrl="/shopping-list">
                                <button
                                    type="button"
                                    className="btn btn-primary h-auto px-4 py-2"
                                >
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>
                    <div className="relative md:hidden" ref={mobileNavRef}>
                        <button
                            ref={mobileButtonRef}
                            type="button"
                            className="btn btn-ghost btn-square h-11 min-h-11 w-11"
                            aria-label={
                                mobileOpen ? "Close navigation menu" : "Open navigation menu"
                            }
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-site-nav"
                            onClick={() => setMobileOpen((current) => !current)}
                        >
                            {mobileOpen ? (
                                <CloseIcon className="size-5" />
                            ) : (
                                <MenuIcon className="size-5" />
                            )}
                        </button>

                        {mobileOpen && (
                            <div
                                id="mobile-site-nav"
                                className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[min(21rem,calc(100vw-2rem))] rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
                            >
                                <Show when="signed-in">
                                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-base-content/60">
                                        Grocery
                                    </div>

                                    <ul className="menu w-full gap-1">
                                        {navLinks.map((link) => {
                                            const active = isActive(pathname, link.href);

                                            return (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={closeMobileMenu}
                                                        aria-current={active ? "page" : undefined}
                                                        className={active ? "active" : undefined}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <div className="mt-2 border-t border-base-300 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-base-content/60">
                                        Account
                                    </div>

                                    <div className="flex items-center justify-between px-3 pb-3">
                                        <span className="text-sm text-base-content/70">
                                            Signed in
                                        </span>

                                        <UserButton />
                                    </div>
                                </Show>

                                <Show when="signed-out">
                                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-base-content/60">
                                        Account
                                    </div>

                                    <div className="grid gap-2 px-2 pb-2">
                                        <SignUpButton
                                            mode="modal"
                                            forceRedirectUrl="/shopping-list"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-primary h-auto w-full px-4 py-2"
                                                onClick={closeMobileMenu}
                                            >
                                                Get Started
                                            </button>
                                        </SignUpButton>

                                        <SignInButton
                                            mode="modal"
                                            forceRedirectUrl="/shopping-list"
                                        >
                                            <button
                                                type="button"
                                                className="btn btn-outline h-auto w-full px-4 py-2"
                                                onClick={closeMobileMenu}
                                            >
                                                Sign In
                                            </button>
                                        </SignInButton>
                                    </div>
                                </Show>
                            </div>
                        )}
                    </div>
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