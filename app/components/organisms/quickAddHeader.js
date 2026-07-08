import Link from "next/link";

export default function QuickAddHeader({ activeListId }) {
    return (
        <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
            <h1 className="text-3xl font-bold">Quick Add Items</h1>

            <p className="mt-2 text-sm text-base-content/75">
                Save groceries you buy often, then add them to your shopping list with
                one tap.
            </p>

            <div className="mt-4">
                <Link
                    href={
                        activeListId ? `/shopping-list?list=${activeListId}` : "/shopping-list"
                    }
                    className="btn btn-outline h-auto px-4 py-2"
                >
                    Back to Shopping List
                </Link>
            </div>
        </section>
    );
}