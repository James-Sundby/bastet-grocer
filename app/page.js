import Image from "next/image";
import SignInCard from "./components/organisms/signInCard";

export default function Home() {

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-base-200" role="main">
      <div className="relative h-custom w-full">
        <Image
          src="/grocery.webp"
          alt="Background image of a row of vegetables placed on multilayered display fridge at a grocery store."
          fill={true}
          priority={true}
          sizes="100vw"
          style={{ objectFit: "cover", filter: "brightness(0.5)" }}
        />

        <div className="absolute flex items-center justify-center w-full h-full p-4 md:p-8">
          <SignInCard />
        </div>

        <aside className="text-center text-neutral-content absolute bottom-2 w-full">
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