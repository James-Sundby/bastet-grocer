"use client";

import {
	OrganizationSwitcher,
	Show,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";

import { SignInIcon, SignUpIcon } from "@/app/components/atoms/icons";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-base-300 bg-base-100 shadow backdrop-blur flex flex-col items-center">
			<nav className="navbar px-4 md:px-8" aria-label="Main navigation">
				<div className="navbar-start">
					<p className="h-auto text-lg font-black text-primary sm:text-xl md:text-2xl lg:text-4xl">
						Bastet Grocer
					</p>
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
				<div className="navbar border-t border-base-300 md:hidden">
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
