"use client";

import { SignInButton, SignUpButton, } from "@clerk/nextjs";
import { ArrowRightIcon } from "@/app/components/atoms/icons";

export default function LandingAuthActions() {
    return (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <SignUpButton
                mode="modal"
                forceRedirectUrl="/shopping-list"
            >
                <button
                    type="button"
                    className="btn btn-primary btn-lg h-auto px-5 py-3"
                >
                    Get Started
                    <ArrowRightIcon />
                </button>
            </SignUpButton>

            <SignInButton
                mode="modal"
                forceRedirectUrl="/shopping-list"
            >
                <button
                    type="button"
                    className="btn btn-outline btn-lg h-auto border-neutral-content px-5 py-3 text-neutral-content hover:text-base-content"
                >
                    Sign In
                </button>
            </SignInButton>
        </div>
    );
}