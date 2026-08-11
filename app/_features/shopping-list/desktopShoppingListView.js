"use client";

import { useEffect, useState } from "react";

import DesktopItemSidebar from "./desktopItemSidebar";
import DesktopItemTable from "./desktopItemTable";

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
    const [selectedItemId, setSelectedItemId] =
        useState(null);

    const selectedItem =
        shoppingList.items.find(
            (item) => item.id === selectedItemId
        ) ?? null;

    const handleSelectItem = (itemId) => {
        setSelectedItemId((currentItemId) =>
            currentItemId === itemId
                ? null
                : itemId
        );
    };

    // A different shopping list should not keep the
    // previous list's selected item.
    useEffect(() => {
        setSelectedItemId(null);
    }, [activeListId]);

    // Realtime or another client may delete the
    // currently selected item.
    useEffect(() => {
        if (
            selectedItemId &&
            !shoppingList.items.some(
                (item) =>
                    item.id === selectedItemId
            )
        ) {
            setSelectedItemId(null);
        }
    }, [
        selectedItemId,
        shoppingList.items,
    ]);

    return (
        <div className="grid h-full min-h-0 grid-cols-[17rem_minmax(0,1fr)] overflow-hidden rounded-sm border border-base-300 bg-base-100 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <DesktopItemSidebar
                activeList={activeList}
                activeListId={activeListId}
                selectedItem={selectedItem}
                listManagerProps={listManagerProps}
                onAddItem={shoppingList.handleAddItem}
                onUpdateItem={shoppingList.handleUpdateItem}
                onDeleteItem={shoppingList.handleRemoveItem}
                onCancelEdit={() =>
                    setSelectedItemId(null)
                }
                suggestCategory={suggestCategory}
                rememberCategoryPreference={
                    rememberCategoryPreference
                }
            />

            <DesktopItemTable
                activeList={activeList}
                items={shoppingList.items}
                selectedItemId={selectedItemId}
                completedCount={
                    shoppingList.completedCount
                }
                onSelectItem={handleSelectItem}
                onStatusChange={
                    shoppingList.handleItemStatusChange
                }
                onChangeQuantity={
                    shoppingList.handleChangeQuantity
                }
                onClearCompleted={
                    onRequestClearCompleted
                }
                onDeleteAll={
                    onRequestDeleteAll
                }
            />
        </div>
    );
}