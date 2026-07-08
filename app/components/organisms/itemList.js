"use client";

import { useId, useMemo, useState } from "react";
import ItemCard from "../molecules/itemCard.js";

export default function ItemList({
    items,
    onDelete,
    onStatusChange,
    onAdd,
    onIncrement,
    onDecrement,
    onUpdate,
    isQuickAdd = false,
    isShoppingMode = false,
}) {
    const [sortBy, setSortBy] = useState("category");
    const sortGroupId = useId();

    const itemsData = useMemo(() => {
        return [...items].sort((a, b) => {
            if (!isQuickAdd && Boolean(a.completed) !== Boolean(b.completed)) {
                return Number(a.completed) - Number(b.completed);
            }

            if (sortBy === "name") {
                return a.name.localeCompare(b.name, undefined, {
                    sensitivity: "base",
                });
            }

            if (sortBy === "category") {
                const categoryComparison = a.category.localeCompare(
                    b.category,
                    undefined,
                    { sensitivity: "base" }
                );

                if (categoryComparison !== 0) {
                    return categoryComparison;
                }

                return a.name.localeCompare(b.name, undefined, {
                    sensitivity: "base",
                });
            }

            return 0;
        });
    }, [items, sortBy, isQuickAdd]);

    const emptyTitle = isQuickAdd ? "No quick adds yet" : "No items yet";
    const emptyMessage = isQuickAdd
        ? "Add a few common groceries to speed up future lists."
        : "Add your first grocery item above.";

    return (
        <section className="space-y-4 w-full">

            <div className="join flex w-full rounded-md">
                <input
                    className="join-item btn flex-1"
                    type="radio"
                    name={`${sortGroupId}-sort-options`}
                    aria-label="Sort by category"
                    checked={sortBy === "category"}
                    onChange={() => setSortBy("category")}
                />

                <input
                    className="join-item btn flex-1"
                    type="radio"
                    name={`${sortGroupId}-sort-options`}
                    aria-label="Sort by name"
                    checked={sortBy === "name"}
                    onChange={() => setSortBy("name")}
                />
            </div>

            {itemsData.length === 0 ? (
                <div className=" rounded-box border border-dashed border-base-300 bg-base-100 p-6 text-center text-base-content/70">
                    <p className="font-semibold">{emptyTitle}</p>
                    <p className="text-sm">{emptyMessage}</p>
                </div>
            ) : (
                <ul className=" flex flex-col gap-3">
                    {itemsData.map((item) => (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            quantity={item.quantity}
                            category={item.category}
                            note={item.note ?? ""}
                            completed={item.completed}
                            onDelete={onDelete}
                            onStatusChange={!isQuickAdd ? onStatusChange : undefined}
                            onAdd={isQuickAdd ? onAdd : undefined}
                            onUpdate={isShoppingMode ? undefined : onUpdate}
                            isQuickAdd={isQuickAdd}
                            isShoppingMode={isShoppingMode}
                            onDecrement={isShoppingMode ? undefined : onDecrement}
                            onIncrement={isShoppingMode ? undefined : onIncrement}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}