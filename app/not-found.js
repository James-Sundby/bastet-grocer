import Link from "next/link";
import { ArrowRightIcon } from "./components/atoms/icons";

export default function NotFound() {
    return (
        <main className="hero flex-1 bg-base-200 px-4">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-7xl font-black text-primary sm:text-9xl">404</h1>
                    <h2 className="mt-4 text-2xl font-bold">Page not found</h2>
                    <p className="mt-2 text-base-content/70">
                        We couldn&apos;t find the page you were looking for.
                    </p>
                    <Link href="/" className="btn btn-primary mt-6 h-auto px-4 py-2" >
                        Back to Home
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </main>
    );
}