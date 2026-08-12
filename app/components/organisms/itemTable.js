"use client";

import {
    useMemo,
    useState,
} from "react";

import { CATEGORIES } from "@/app/constants/categories";

const categoryOrder = new Map(
    CATEGORIES.map((category, index) => [
        category.value,
        index,
    ])
);

function compareText(a = "", b = "") {
    return a.localeCompare(
        b,
        undefined,
        {
            sensitivity: "base",
        }
    );
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
            ? <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="size-3 fill-current"
            >
                <path d="M342.6 41.4C330.1 28.9 309.8 28.9 297.3 41.4L169.3 169.4C156.8 181.9 156.8 202.2 169.3 214.7C181.8 227.2 202.1 227.2 214.6 214.7L288 141.3L288 576C288 593.7 302.3 608 320 608C337.7 608 352 593.7 352 576L352 141.3L425.4 214.7C437.9 227.2 458.2 227.2 470.7 214.7C483.2 202.2 483.2 181.9 470.7 169.4L342.7 41.4z" />
            </svg>
            : <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="size-3 fill-current"
            >
                <path d="M297.4 598.6C309.9 611.1 330.2 611.1 342.7 598.6L470.7 470.6C483.2 458.1 483.2 437.8 470.7 425.3C458.2 412.8 437.9 412.8 425.4 425.3L352 498.7L352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 498.7L214.6 425.3C202.1 412.8 181.8 412.8 169.3 425.3C156.8 437.8 156.8 458.1 169.3 470.6L297.3 598.6z" />
            </svg>
        : <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="size-3 fill-current"
        >
            <path d="M470.6 566.6L566.6 470.6C575.8 461.4 578.5 447.7 573.5 435.7C568.5 423.7 556.9 416 544 416L480 416L480 96C480 78.3 465.7 64 448 64C430.3 64 416 78.3 416 96L416 416L352 416C339.1 416 327.4 423.8 322.4 435.8C317.4 447.8 320.2 461.5 329.3 470.7L425.3 566.7C437.8 579.2 458.1 579.2 470.6 566.7zM214.6 73.4C202.1 60.9 181.8 60.9 169.3 73.4L73.3 169.4C64.1 178.6 61.4 192.3 66.4 204.3C71.4 216.3 83.1 224 96 224L160 224L160 544C160 561.7 174.3 576 192 576C209.7 576 224 561.7 224 544L224 224L288 224C300.9 224 312.6 216.2 317.6 204.2C322.6 192.2 319.8 178.5 310.7 169.3L214.7 73.3z" />
        </svg>;

    return (
        <button
            type="button"
            className={`inline-flex items-center gap-1 font-bold transition-colors hover:text-primary ${isActive
                ? "text-primary"
                : ""
                }`}
            onClick={() =>
                onSort(sortKey)
            }
        >
            <span>{children}</span>

            <span
                className={`inline-block w-4 text-center ${isActive
                    ? "text-primary"
                    : "text-base-content/40"
                    }`}
                aria-hidden="true"
            >
                {indicator}
            </span>
        </button>
    );
}

function QuantityControl({
    item,
    onChange,
}) {
    return (
        <div className="flex items-center justify-center gap-1">
            <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() =>
                    onChange(
                        {
                            id: item.id,
                            name: item.name,
                        },
                        -1
                    )
                }
                disabled={
                    item.quantity <= 1
                }
                aria-label={`Decrease ${item.name} quantity`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="size-3 fill-current"
                >
                    <path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z" />
                </svg>
            </button>

            <span className="min-w-8 text-center font-semibold">
                {item.quantity}
            </span>

            <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() =>
                    onChange(
                        {
                            id: item.id,
                            name: item.name,
                        },
                        1
                    )
                }
                disabled={
                    item.quantity >= 99
                }
                aria-label={`Increase ${item.name} quantity`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="size-3 fill-current"
                >
                    <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
                </svg>
            </button>
        </div>
    );
}

export default function ItemTable({
    title,
    description,
    items,
    selectedItemId,
    onSelectItem,
    onChangeQuantity,

    statusColumn = null,
    actionColumn = null,
    headerActions = null,

    emptyTitle = "No items yet",
    emptyMessage =
    "Add your first item using the panel on the left.",

    defaultSort = {
        key: "category",
        direction: "asc",
    },
}) {
    const [sort, setSort] =
        useState(defaultSort);

    const sortedItems = useMemo(() => {
        const nextItems = [...items];

        nextItems.sort((a, b) => {
            let comparison = 0;

            switch (sort.key) {
                case "status":
                    comparison =
                        statusColumn
                            ? Number(
                                statusColumn.getChecked(
                                    a
                                )
                            ) -
                            Number(
                                statusColumn.getChecked(
                                    b
                                )
                            )
                            : 0;
                    break;

                case "name":
                    comparison =
                        compareText(
                            a.name,
                            b.name
                        );
                    break;

                case "category":
                    comparison =
                        (categoryOrder.get(
                            a.category
                        ) ?? 999) -
                        (categoryOrder.get(
                            b.category
                        ) ?? 999);
                    break;

                case "quantity":
                    comparison =
                        a.quantity -
                        b.quantity;
                    break;

                default:
                    comparison = 0;
            }

            if (
                comparison === 0 &&
                sort.key !== "name"
            ) {
                comparison =
                    compareText(
                        a.name,
                        b.name
                    );
            }

            return sort.direction === "asc"
                ? comparison
                : -comparison;
        });

        return nextItems;
    }, [
        items,
        sort,
        statusColumn,
    ]);

    const handleSort = (key) => {
        setSort((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction:
                        current.direction ===
                            "asc"
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
        <section className="flex min-h-0 min-w-0 flex-col bg-base-100">
            <header className="flex shrink-0 items-center justify-between gap-6 border-b border-base-300 px-6 py-5">
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold">
                        {title}
                    </h1>

                    {description && (
                        <div className="mt-1 text-sm text-base-content/60">
                            {description}
                        </div>
                    )}
                </div>

                {headerActions && (
                    <div className="shrink-0">
                        {headerActions}
                    </div>
                )}
            </header>

            {sortedItems.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-12 text-center text-base-content/60">
                    <div>
                        <p className="font-semibold">
                            {emptyTitle}
                        </p>

                        <p className="mt-1 text-sm">
                            {emptyMessage}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="min-h-0 flex-1 overflow-auto bg-base-100">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="border-b border-base-300">
                                {statusColumn && (
                                    <th
                                        className="sticky top-0 z-10 w-24 bg-base-100"
                                        aria-sort={ariaSortFor(
                                            "status"
                                        )}
                                    >
                                        <SortButton
                                            sortKey="status"
                                            currentSort={
                                                sort
                                            }
                                            onSort={
                                                handleSort
                                            }
                                        >
                                            {statusColumn.label ??
                                                "Status"}
                                        </SortButton>
                                    </th>
                                )}

                                <th
                                    className="sticky top-0 z-10 bg-base-100"
                                    aria-sort={ariaSortFor(
                                        "name"
                                    )}
                                >
                                    <SortButton
                                        sortKey="name"
                                        currentSort={
                                            sort
                                        }
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Item
                                    </SortButton>
                                </th>

                                <th
                                    className="sticky top-0 z-10 w-40 bg-base-100 xl:w-44"
                                    aria-sort={ariaSortFor(
                                        "category"
                                    )}
                                >
                                    <SortButton
                                        sortKey="category"
                                        currentSort={
                                            sort
                                        }
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Category
                                    </SortButton>
                                </th>

                                <th
                                    className="sticky top-0 z-10 w-32 bg-base-100 text-center xl:w-40"
                                    aria-sort={ariaSortFor(
                                        "quantity"
                                    )}
                                >
                                    <SortButton
                                        sortKey="quantity"
                                        currentSort={
                                            sort
                                        }
                                        onSort={
                                            handleSort
                                        }
                                    >
                                        Qty
                                    </SortButton>
                                </th>

                                {actionColumn && (
                                    <th
                                        className={`sticky top-0 z-10 bg-base-100 ${actionColumn.widthClass ?? ""}`}
                                    >
                                        {actionColumn.label}
                                    </th>
                                )}

                                <th className="sticky top-0 z-10 w-24 min-w-24 bg-base-100">
                                    <span className="sr-only">
                                        Edit
                                    </span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="[&>tr:last-child>td]:border-b [&>tr:last-child>td]:border-base-300">
                            {sortedItems.map(
                                (item) => {
                                    const isSelected =
                                        item.id ===
                                        selectedItemId;

                                    const isChecked =
                                        statusColumn
                                            ? statusColumn.getChecked(
                                                item
                                            )
                                            : false;

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className={
                                                isChecked
                                                    ? "text-base-content/50"
                                                    : ""
                                            }
                                        >
                                            {statusColumn && (
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary checkbox-sm"
                                                        checked={
                                                            isChecked
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            statusColumn.onChange(
                                                                item.id,
                                                                event
                                                                    .target
                                                                    .checked
                                                            )
                                                        }
                                                        aria-label={
                                                            statusColumn.getAriaLabel?.(
                                                                item
                                                            ) ??
                                                            `Toggle ${item.name}`
                                                        }
                                                    />
                                                </td>
                                            )}

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
                                                        className={`block font-semibold ${isChecked
                                                            ? "line-through"
                                                            : ""
                                                            } ${isSelected
                                                                ? "text-primary"
                                                                : ""
                                                            }`}
                                                    >
                                                        {
                                                            item.name
                                                        }
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
                                                <QuantityControl
                                                    item={
                                                        item
                                                    }
                                                    onChange={
                                                        onChangeQuantity
                                                    }
                                                />
                                            </td>

                                            {actionColumn && (
                                                <td
                                                    className={
                                                        actionColumn.widthClass ??
                                                        ""
                                                    }
                                                >
                                                    {actionColumn.render(
                                                        item
                                                    )}
                                                </td>
                                            )}

                                            <td className="w-24 min-w-24">
                                                <button
                                                    type="button"
                                                    className={`btn btn-ghost btn-sm w-full ${isSelected
                                                        ? "text-primary"
                                                        : ""
                                                        }`}
                                                    onClick={() =>
                                                        onSelectItem(
                                                            item.id
                                                        )
                                                    }
                                                    aria-label={
                                                        isSelected
                                                            ? `Close editor for ${item.name}`
                                                            : `Edit ${item.name}`
                                                    }
                                                >
                                                    {isSelected
                                                        ? "Close"
                                                        : "Edit"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}