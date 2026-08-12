"use client";

import {
    useEffect,
    useState,
} from "react";
import Link from "next/link";

import ListManager from "@/app/components/organisms/listManager";
import ItemSidebar from "@/app/components/organisms/itemSidebar";
import ItemTable from "@/app/components/organisms/itemTable";

const editorCopy = {
    addTitle: "Add Item",
    addDescription:
        "Add something to the current shopping list.",
    addSubmitLabel: "Add Item",
    addSavingLabel: "Adding...",

    editTitle: "Edit Item",
    editDescription:
        "Update this grocery item.",
    editSubmitLabel: "Save",
    editSavingLabel: "Saving...",

    deleteTitle: "Delete Item",
    deleteLabel: "Delete Item",
    deletingLabel: "Deleting...",
};

export default function DesktopShoppingListView({
    activeList,
    activeListId,
    listManagerProps,
    shoppingList,
    suggestCategory,
    rememberCategoryPreference,
    onRequestClearCompleted,
    onRequestDeleteAll,
}) {
    const [
        selectedItemId,
        setSelectedItemId,
    ] = useState(null);

    const selectedItem =
        shoppingList.items.find(
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
        setSelectedItemId(null);
    }, [activeListId]);

    useEffect(() => {
        if (
            selectedItemId &&
            !shoppingList.items.some(
                (item) =>
                    item.id ===
                    selectedItemId
            )
        ) {
            setSelectedItemId(null);
        }
    }, [
        selectedItemId,
        shoppingList.items,
    ]);

    const sidebarFooter = (
        <div className="grid gap-2">
            <Link
                href={
                    activeListId
                        ? `/quick-add?list=${activeListId}`
                        : "/quick-add"
                }
                className="btn btn-outline h-auto px-4 py-2"
            >
                Quick Adds
            </Link>

            <ListManager
                {...listManagerProps}
            />
        </div>
    );

    const headerActions =
        shoppingList.items.length > 0 ? (
            <div className="flex items-center gap-2">
                {shoppingList.completedCount >
                    0 && (
                        <button
                            type="button"
                            className="btn btn-outline btn-sm h-auto px-3 py-2"
                            onClick={
                                onRequestClearCompleted
                            }
                        >
                            Remove checked (
                            {
                                shoppingList.completedCount
                            }
                            )
                        </button>
                    )}

                {shoppingList.items.length >
                    1 && (
                        <button
                            type="button"
                            className="btn btn-error btn-outline btn-sm h-auto px-3 py-2"
                            onClick={
                                onRequestDeleteAll
                            }
                        >
                            Clear list
                        </button>
                    )}
            </div>
        ) : null;

    return (
        <div className="grid h-full min-h-0 grid-cols-[17rem_minmax(0,1fr)] overflow-hidden rounded-sm border border-base-300 bg-base-100 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <ItemSidebar
                selectedItem={
                    selectedItem
                }
                copy={editorCopy}
                onAddItem={(item) =>
                    shoppingList.handleAddItem({
                        ...item,
                        completed: false,
                    })
                }
                onUpdateItem={
                    shoppingList.handleUpdateItem
                }
                onDeleteItem={
                    shoppingList.handleRemoveItem
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
                title={
                    activeList?.title ??
                    "Shopping List"
                }
                description={
                    <>
                        {
                            shoppingList.items
                                .length
                        }{" "}
                        item
                        {shoppingList.items
                            .length === 1
                            ? ""
                            : "s"}

                        {shoppingList.completedCount >
                            0 &&
                            ` · ${shoppingList.completedCount} checked`}
                    </>
                }
                items={
                    shoppingList.items
                }
                selectedItemId={
                    selectedItemId
                }
                onSelectItem={
                    handleSelectItem
                }
                onChangeQuantity={
                    shoppingList.handleChangeQuantity
                }
                statusColumn={{
                    label: "Status",
                    getChecked: (item) =>
                        item.completed,
                    onChange:
                        shoppingList.handleItemStatusChange,
                    getAriaLabel: (item) =>
                        `Mark ${item.name} as checked`,
                }}
                headerActions={
                    headerActions
                }
                emptyTitle="No items yet"
                emptyMessage="Add your first grocery item using the panel on the left."
            />
        </div>
    );
}