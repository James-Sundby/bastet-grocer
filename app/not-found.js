import Link from "next/link";
import { ArrowRightIcon } from "./components/atoms/icons";

export default function NotFound() {
    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="card border border-primary text-base-content w-full max-w-xl ">
                <div className="card-body items-center text-center">
                    <h1 className="card-title text-5xl sm:text-9xl font-black">404</h1>
                    <p className="text-lg">Oops! We couldn&apos;t find that page.</p>
                    <Link className="mt-4 btn btn-primary justify-between max-w-[261px] w-full h-auto px-4 py-2" href="/">
                        Back to Home
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </div>
    );
}