import Link from "next/link";

export default function ShoppingListHeader({
    activeList,
    activeListId,
    isShoppingMode,
    remainingCount,
    completedCount,
    onToggleShoppingMode,
    listManager,
}) {
    return (
        <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
            <h1 className="text-3xl font-bold">
                {isShoppingMode ? "Shopping Mode" : "Shopping List"}
            </h1>
            {activeList && (
                <p className="mt-2 text-base-content/75">
                    <span className="font-bold text-primary">Active List:</span>{" "}
                    <span className="font-bold"> {activeList.title}</span>
                </p>
            )}
            {!isShoppingMode && (
                <p className="mt-2 text-sm text-base-content/75">
                    Add groceries, check them off as you shop, and keep your list synced across devices.
                </p>
            )}
            {isShoppingMode && (
                <p className="mt-2 text-sm text-base-content/75">
                    {remainingCount} left · {completedCount} checked
                </p>
            )}
            <div className="mt-4 flex flex-col gap-2">
                <button
                    type="button"
                    className={`btn btn-xl h-auto px-8 py-4 ${isShoppingMode ? "btn-accent" : "btn-primary"
                        }`}
                    onClick={onToggleShoppingMode}
                >
                    {isShoppingMode ? "Exit Shopping Mode" : "Start Shopping"}
                </button>

                {!isShoppingMode && (
                    <div className="grid grid-cols-2  gap-2 ">
                        <Link
                            href={
                                activeListId
                                    ? `/quick-add?list=${activeListId}`
                                    : "/quick-add"
                            }
                            className="btn btn-outline h-auto px-4 py-2"
                        >
                            See my Quick Adds
                        </Link>

                        {listManager}
                    </div>
                )}
            </div>
        </section>
    );
}