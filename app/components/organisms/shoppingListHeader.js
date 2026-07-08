import Link from "next/link";

export default function ShoppingListHeader({
    lists,
    activeList,
    activeListId,
    isShoppingMode,
    remainingCount,
    completedCount,
    onListChange,
    onToggleShoppingMode,
}) {
    return (
        <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
            {activeList?.title && (
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {activeList.title}
                </p>
            )}

            <h1 className="mt-2 text-3xl font-bold">
                {isShoppingMode ? "Shopping Mode" : "Shopping List"}
            </h1>

            <p className="mt-2 text-sm text-base-content/75">
                {isShoppingMode
                    ? `${remainingCount} left · ${completedCount} checked`
                    : "Add groceries, check them off as you shop, and keep your list synced across devices."}
            </p>

            {lists.length > 1 && !isShoppingMode && (
                <label className="form-control mx-auto mt-4 w-full max-w-xs">
                    <span className="label-text mb-1 text-left font-bold">
                        Active List
                    </span>

                    <select
                        className="select select-bordered w-full"
                        value={activeListId ?? ""}
                        onChange={onListChange}
                    >
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.title}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                    type="button"
                    className={isShoppingMode ? "btn btn-outline" : "btn btn-primary"}
                    onClick={onToggleShoppingMode}
                >
                    {isShoppingMode ? "Exit Shopping Mode" : "Start Shopping Mode"}
                </button>

                {!isShoppingMode && (
                    <Link
                        href={
                            activeListId ? `/quick-add?list=${activeListId}` : "/quick-add"
                        }
                        className="btn btn-outline h-auto px-4 py-2"
                    >
                        Manage Quick Adds
                    </Link>
                )}
            </div>
        </section>
    );
}