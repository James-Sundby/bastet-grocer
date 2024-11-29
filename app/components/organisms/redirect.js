import Link from "next/link";

export default function Redirect() {
  return (
    <div className="hero h-custom">
      <div className="hero-content text-center -translate-y-16">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Sorry</h1>
          <p className="py-6">
            You must be signed in to view this page. Please sign in with Google
            on the main page.
          </p>
          <button className="btn btn-primary rounded-md">
            <Link href="/">Home</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
