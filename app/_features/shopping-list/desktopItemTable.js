"use client";

import { useMemo, useState } from "react";

import { CATEGORIES } from "@/app/constants/categories";

const categoryOrder = new Map(
    CATEGORIES.map((category, index) => [
        category.value,
        index,
    ])
);

function compareText(a, b) {
    return a.localeCompare(b, undefined, {
        sensitivity: "base",
    });
}

function SortButton({
    children,
    sortKey,
    currentSort,
    onSort,
}) {
    const isActive =
        currentSort.key === sortKey;

    const indicator = isActive
        ? currentSort.direction === "asc"
            ? "↑"
            : "↓"
        : "↕";

    return (
        <button
            type="button"
            className={`inline-flex items-center gap-1 font-bold ${isActive
                ? "text-primary"
                : ""
                }`}
            onClick={() => onSort(sortKey)}
        >
            <span>{children}</span>

            <span
                className={`inline-flex items-center gap-1 font-bold transition-colors hover:text-primary ${isActive
                    ? "text-primary"
                    : ""
                    }`}
                aria-hidden="true"
            >
                {indicator}
            </span>
        </button>
    );
}

export default function DesktopItemTable({
    activeList,
    items,
    selectedItemId,
    completedCount,
    onSelectItem,
    onStatusChange,
    onChangeQuantity,
    onClearCompleted,
    onDeleteAll,
}) {
    const [sort, setSort] = useState({
        key: "category",
        direction: "asc",
    });

    const sortedItems = useMemo(() => {
        const nextItems = [...items];

        nextItems.sort((a, b) => {
            let comparison = 0;

            if (sort.key === "status") {
                comparison =
                    Number(a.completed) -
                    Number(b.completed);
            } else {
                // Regardless of the selected column,
                // unchecked groceries stay above checked ones.
                if (
                    Boolean(a.completed) !==
                    Boolean(b.completed)
                ) {
                    return (
                        Number(a.completed) -
                        Number(b.completed)
                    );
                }

                if (sort.key === "name") {
                    comparison = compareText(
                        a.name,
                        b.name
                    );
                }

                if (sort.key === "category") {
                    comparison =
                        (categoryOrder.get(
                            a.category
                        ) ?? 999) -
                        (categoryOrder.get(
                            b.category
                        ) ?? 999);

                    if (comparison === 0) {
                        comparison = compareText(
                            a.name,
                            b.name
                        );
                    }
                }

                if (sort.key === "quantity") {
                    comparison =
                        a.quantity - b.quantity;
                }
            }

            return sort.direction === "asc"
                ? comparison
                : -comparison;
        });

        return nextItems;
    }, [items, sort]);

    const handleSort = (key) => {
        setSort((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction:
                        current.direction === "asc"
                            ? "desc"
                            : "asc",
                };
            }

            return {
                key,
                direction: "asc",
            };
        });
    };

    const ariaSortFor = (key) => {
        if (sort.key !== key) {
            return "none";
        }

        return sort.direction === "asc"
            ? "ascending"
            : "descending";
    };

    return (
        <section className="flex min-h-0 min-w-0 flex-col">
            <header className="flex shrink-0 items-center justify-between gap-6 border-b border-base-300 px-6 py-5">                <div>
                <h1 className="text-2xl font-bold">
                    {activeList?.title ??
                        "Shopping List"}
                </h1>

                <p className="mt-1 text-sm text-base-content/60">
                    {items.length} item
                    {items.length === 1
                        ? ""
                        : "s"}
                    {completedCount > 0 &&
                        ` · ${completedCount} checked`}
                </p>
            </div>

                {items.length > 0 && (
                    <div className="flex items-center gap-2">
                        {completedCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-outline btn-sm h-auto px-3 py-2"
                                onClick={
                                    onClearCompleted
                                }
                            >
                                Remove checked (
                                {completedCount})
                            </button>
                        )}

                        {items.length > 1 && (
                            <button
                                type="button"
                                className="btn btn-error btn-outline btn-sm h-auto px-3 py-2"
                                onClick={onDeleteAll}
                            >
                                Clear list
                            </button>
                        )}
                    </div>
                )}
            </header>

            {sortedItems.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-12 text-center text-base-content/60">
                    <div>
                        <p className="font-semibold">
                            No items yet
                        </p>

                        <p className="mt-1 text-sm">
                            Add your first grocery item using the
                            panel on the left.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="min-h-0 flex-1 overflow-auto bg-base-100">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="border-b border-base-300">
                                <th
                                    className="sticky top-0 z-10 w-16 bg-base-100"
                                    aria-sort={ariaSortFor("status")}
                                >
                                    <SortButton
                                        sortKey="status"
                                        currentSort={sort}
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Status
                                    </SortButton>
                                </th>

                                <th
                                    className="sticky top-0 z-10 bg-base-100"
                                    aria-sort={ariaSortFor("name")}
                                >
                                    <SortButton
                                        sortKey="name"
                                        currentSort={sort}
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Item
                                    </SortButton>
                                </th>

                                <th
                                    className="sticky top-0 z-10 w-44 bg-base-100"
                                    aria-sort={ariaSortFor("category")}
                                >
                                    <SortButton
                                        sortKey="category"
                                        currentSort={sort}
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Category
                                    </SortButton>
                                </th>

                                <th
                                    className="sticky top-0 z-10 w-40 bg-base-100 text-center"
                                    aria-sort={ariaSortFor("quantity")}
                                >
                                    <SortButton
                                        sortKey="quantity"
                                        currentSort={sort}
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Qty
                                    </SortButton>
                                </th>

                                <th className="sticky top-0 z-10 w-24 min-w-24 bg-base-100">
                                    <span className="sr-only">
                                        Edit
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="[&>tr:last-child>td]:border-b [&>tr:last-child>td]:border-base-300">
                            {sortedItems.map((item) => {
                                const isSelected =
                                    item.id ===
                                    selectedItemId;

                                return (
                                    <tr
                                        key={item.id}
                                        className={
                                            item.completed
                                                ? "text-base-content/50"
                                                : ""
                                        }
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-sm"
                                                checked={
                                                    item.completed
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    onStatusChange(
                                                        item.id,
                                                        event
                                                            .target
                                                            .checked
                                                    )
                                                }
                                                aria-label={`Mark ${item.name} as checked`}
                                            />
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="block w-full text-left"
                                                onClick={() =>
                                                    onSelectItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <span
                                                    className={`block font-semibold cursor-pointer ${item.completed
                                                        ? "line-through"
                                                        : ""
                                                        } ${isSelected
                                                            ? "text-primary"
                                                            : ""
                                                        }`}
                                                >
                                                    {item.name}
                                                </span>

                                                {item.note && (
                                                    <span className="mt-1 block max-w-xl text-sm text-base-content/60">
                                                        {
                                                            item.note
                                                        }
                                                    </span>
                                                )}
                                            </button>
                                        </td>

                                        <td>
                                            <span className="badge badge-neutral badge-outline h-auto whitespace-normal capitalize">
                                                {
                                                    item.category
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm btn-square"
                                                    onClick={() =>
                                                        onChangeQuantity(
                                                            {
                                                                id: item.id,
                                                                name: item.name,
                                                            },
                                                            -1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <=
                                                        1
                                                    }
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                >
                                                    -
                                                </button>

                                                <span className="min-w-8 text-center font-semibold">
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm btn-square"
                                                    onClick={() =>
                                                        onChangeQuantity(
                                                            {
                                                                id: item.id,
                                                                name: item.name,
                                                            },
                                                            1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        99
                                                    }
                                                    aria-label={`Increase ${item.name} quantity`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>

                                        <td className="w-24 min-w-24">
                                            <button
                                                type="button"
                                                className={`btn btn-ghost btn-sm w-full ${isSelected
                                                    ? "text-primary"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    onSelectItem(item.id)
                                                }
                                                aria-label={
                                                    isSelected
                                                        ? `Close editor for ${item.name}`
                                                        : `Edit ${item.name}`
                                                }
                                            >
                                                {isSelected ? "Close" : "Edit"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}