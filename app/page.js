import dynamic from "next/dynamic";

const HomeWrapper = dynamic(() => import("./components/homeWrapper"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center" role="main">

      <div id="server-placeholder" className="relative h-custom w-full bg-zinc-900">
        <div className="hero-content text-neutral-content text-center flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="max-w-md">
            <p>Loading...</p>
          </div>
        </div>
      </div>

      <HomeWrapper />
    </main>
  );
}
