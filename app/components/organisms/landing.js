import Image from "next/image";
import LandingAuthActions from "@/app/components/molecules/landingAuthActions";

const mockItems = [
    {
        id: "milk",
        name: "Milk",
        quantity: 2,
        category: "dairy",
        note: "2% if they have it",
        completed: false,
    },
    {
        id: "bananas",
        name: "Bananas",
        quantity: 6,
        category: "produce",
        note: "",
        completed: false,
    },
    {
        id: "coffee",
        name: "Coffee",
        quantity: 1,
        category: "dry goods",
        note: "Dark roast",
        completed: true,
    },
];

function MockItemCard({ item }) {
    return (
        <li>
            <article
                className={`pointer-events-none card card-sm border border-base-300 bg-base-100 shadow-sm ${item.completed ? "opacity-60" : ""
                    }`}
            >
                <div className="card-body gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-lg shrink-0"
                                    checked={item.completed}
                                    readOnly
                                    tabIndex={-1}
                                    aria-label={`${item.name} sample item`}
                                />

                                <div className="min-w-0">
                                    <p
                                        className={`wrap-break-word text-xl font-bold leading-tight ${item.completed ? "line-through" : ""
                                            }`}
                                    >
                                        {item.name}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="badge badge-neutral badge-outline">
                                            Qty: <span className="font-bold">{item.quantity}</span>
                                        </span>

                                        <span className="badge badge-neutral badge-outline h-auto wrap-break-word capitalize">
                                            {item.category}
                                        </span>
                                    </div>

                                    {item.note && (
                                        <p className="mt-2 text-sm text-base-content/70">
                                            {item.note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </article>
        </li>
    );
}

export default function Landing() {
    return (
        <main className="relative flex flex-1 flex-col bg-base-200" role="main">
            <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-12 md:px-8">
                <Image
                    src="/grocery.webp"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="-z-10 object-cover brightness-[0.35]"
                />

                <div className="absolute inset-0 -z-5 backdrop-blur-xs" />

                <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-black text-primary sm:text-6xl lg:text-7xl">
                            Bastet Grocer
                        </h1>

                        <h2 className="mt-4 text-3xl font-semibold text-neutral-content sm:text-4xl lg:text-5xl">
                            Stop forgetting the milk.
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-base text-neutral-content lg:mx-0">
                            Build a grocery list, save your commonly purchased items, and keep the
                            everyone on the same page during quick trips to the store.
                        </p>

                        <LandingAuthActions />
                    </div>

                    <section
                        className="w-full rounded-md border border-base-300 bg-base-100 p-4 shadow-lg md:p-5"
                        aria-label="Sample grocery list preview"
                    >
                        <div className="flex items-start">
                            <h2 className="text-2xl font-bold">Grocery List</h2>
                        </div>

                        <ul className="mt-5 grid gap-3">
                            {mockItems.map((item) => (
                                <MockItemCard key={item.id} item={item} />
                            ))}
                        </ul>


                    </section>
                </div>

                <aside className="text-center text-neutral-content absolute bottom-2 w-full">
                    Photo by{" "}
                    <a
                        href="https://unsplash.com/@scottiewarman?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                        className="underline hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Scott Warman
                    </a>{" "}
                    on{" "}
                    <a
                        href="https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                        className="underline hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Unsplash
                    </a>
                </aside>
            </section>
        </main>
    );
}