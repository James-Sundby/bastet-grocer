"use client";

import {
    useEffect,
    useState,
} from "react";
import Link from "next/link";

import ItemSidebar from "@/app/components/organisms/itemSidebar";
import ItemTable from "@/app/components/organisms/itemTable";
import { ArrowRightIcon, AddtoCartIcon } from "@/app/components/atoms/icons";

const editorCopy = {
    addTitle: "Add Quick Add",
    addDescription:
        "Save something you buy regularly.",
    addSubmitLabel: "Save Quick Add",
    addSavingLabel: "Saving...",

    editTitle: "Edit Quick Add",
    editDescription:
        "Update this saved grocery item.",
    editSubmitLabel: "Save",
    editSavingLabel: "Saving...",

    deleteTitle: "Delete Quick Add",
    deleteLabel: "Delete Quick Add",
    deletingLabel: "Deleting...",
};

export default function DesktopQuickAddView({
    activeList,
    activeListId,
    quickAdds,
    suggestCategory,
    rememberCategoryPreference,
}) {
    const [
        selectedItemId,
        setSelectedItemId,
    ] = useState(null);

    const [
        addingItemId,
        setAddingItemId,
    ] = useState(null);

    const selectedItem =
        quickAdds.items.find(
            (item) =>
                item.id === selectedItemId
        ) ?? null;

    const handleSelectItem = (itemId) => {
        setSelectedItemId(
            (currentItemId) =>
                currentItemId === itemId
                    ? null
                    : itemId
        );
    };

    useEffect(() => {
        if (
            selectedItemId &&
            !quickAdds.items.some(
                (item) =>
                    item.id ===
                    selectedItemId
            )
        ) {
            setSelectedItemId(null);
        }
    }, [
        selectedItemId,
        quickAdds.items,
    ]);

    const handleAddToShoppingList =
        async (item) => {
            if (addingItemId) {
                return;
            }

            try {
                setAddingItemId(item.id);

                await quickAdds.handleAddToShoppingList(
                    item
                );
            } finally {
                setAddingItemId(null);
            }
        };

    const sidebarFooter = (
        <>
            <p className="text-sm font-bold">
                Adding to
            </p>

            <p className="mt-1 text-sm text-base-content/70">
                {activeList?.title ??
                    "Shopping List"}
            </p>

            <Link
                href={
                    activeListId
                        ? `/shopping-list?list=${activeListId}`
                        : "/shopping-list"
                }
                className="btn btn-outline mt-3 h-auto w-full px-4 py-2"
            >
                Go to Shopping List
                <ArrowRightIcon size="size-4" />
            </Link>
        </>
    );

    return (
        <div className="grid h-full min-h-0 grid-cols-[17rem_minmax(0,1fr)] overflow-hidden rounded-sm border border-base-300 bg-base-100 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <ItemSidebar
                selectedItem={
                    selectedItem
                }
                copy={editorCopy}
                onAddItem={
                    quickAdds.handleAddItem
                }
                onUpdateItem={
                    quickAdds.handleUpdateQuickAddItem
                }
                onDeleteItem={
                    quickAdds.handleRemoveItem
                }
                onCancelEdit={() =>
                    setSelectedItemId(null)
                }
                suggestCategory={
                    suggestCategory
                }
                rememberCategoryPreference={
                    rememberCategoryPreference
                }
                footer={sidebarFooter}
            />

            <ItemTable
                title="Quick Adds"
                description={
                    <>
                        {
                            quickAdds.items
                                .length
                        }{" "}
                        saved item
                        {quickAdds.items
                            .length === 1
                            ? ""
                            : "s"}

                        {activeList && (
                            <>
                                {" · "}
                                <span className="font-semibold text-primary">
                                    Adding to{" "}
                                    {
                                        activeList.title
                                    }
                                </span>
                            </>
                        )}
                    </>
                }
                items={quickAdds.items}
                selectedItemId={
                    selectedItemId
                }
                onSelectItem={
                    handleSelectItem
                }
                onChangeQuantity={
                    quickAdds.handleChangeQuantity
                }
                actionColumn={{
                    label: "Add to Cart",
                    widthClass:
                        "w-36 min-w-36",
                    render: (item) => {
                        const isAdding =
                            addingItemId ===
                            item.id;

                        return (
                            <button
                                type="button"
                                className="btn btn-primary btn-sm w-full"
                                onClick={() =>
                                    handleAddToShoppingList(item)
                                }
                                disabled={isAdding}
                                aria-label={`Add ${item.name} to ${activeList?.title ?? "shopping list"
                                    }`}
                            >
                                <AddtoCartIcon size="size-4" />
                                {isAdding ? "Adding..." : "Add"}
                            </button>
                        );
                    },
                }}
                emptyTitle="No Quick Adds yet"
                emptyMessage="Save your first frequently purchased item using the panel on the left."
            />
        </div>
    );
}