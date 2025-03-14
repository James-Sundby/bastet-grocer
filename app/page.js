import Image from "next/image";

import SignInCard from "./components/organisms/signInCard";

export default function Home() {

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-900" role="main">
      <div className="relative h-custom w-full">
        <Image
          src="/grocery.webp"
          alt="Grocery background"
          fill={true}
          priority={true}
          style={{ objectFit: "cover", opacity: 0.25 }}
        />

        <div className="absolute flex items-center justify-center w-full h-full">
          <SignInCard />
        </div>

        <aside className="text-center text-gray-400 absolute bottom-2 w-full">
          <p>
            Photo by{" "}
            <a
              href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
            >
              Scott Warman
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="underline"
            >
              Unsplash
            </a>
          </p>
        </aside>
      </div>
    </main>
  );
}