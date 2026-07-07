import Link from "next/link";
import { GithubIcon } from "../atoms/icons";

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

            <nav className="flex-none" aria-label="External links">
                <a
                    href="https://github.com/James-Sundby"
                    className="btn btn-ghost btn-square"
                    title="Go to GitHub profile of James Sundby"
                    aria-label="Go to GitHub profile of James Sundby"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GithubIcon />
                </a>
            </nav>
        </header>
    );
}