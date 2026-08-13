"use client";

import {
	OrganizationSwitcher,
	Show,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

import { SignInIcon, SignUpIcon } from "@/app/components/atoms/icons";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-base-300 bg-base-100 shadow backdrop-blur">
			<nav
				className="navbar max-w-7xl mx-auto px-3 lg:p-0"
				aria-label="Main navigation"
			>
				<div className="navbar-start">
					<Link
						href="/"
						className="btn btn-ghost h-auto px-2 py-2 text-lg font-black text-primary sm:px-3 sm:text-xl"
						aria-label="Go to Bastet Grocer home page"
						title="Go to Bastet Grocer home page"
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
							<SignUpButton mode="modal" forceRedirectUrl="/shopping-list">
								<button
									type="button"
									className="btn btn-primary btn-sm sm:btn-md"
								>
									Create Account
									<SignUpIcon size="size-4" />
								</button>
							</SignUpButton>
							<SignInButton mode="modal" forceRedirectUrl="/shopping-list">
								<button
									type="button"
									className="btn btn-outline btn-sm sm:btn-md"
								>
									Sign In
									<SignInIcon size="size-4" />
								</button>
							</SignInButton>
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
