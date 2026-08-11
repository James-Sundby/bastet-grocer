"use client";

import { useState } from "react";

import ShoppingListHeader from "@/app/components/organisms/shoppingListHeader";
import ShoppingListFooterActions from "@/app/components/organisms/shoppingListFooterActions";
import ListManager from "@/app/components/organisms/listManager";
import NewItemForm from "@/app/components/molecules/newItemForm";
import ItemList from "@/app/components/organisms/itemList";

export default function MobileShoppingListView({
    activeList,
    activeListId,
    listManagerProps,
    shoppingList,
    suggestCategory,
    rememberCategoryPreference,
    onRequestClearCompleted,
    onRequestDeleteAll,
}) {
    const [isShoppingMode, setIsShoppingMode] =
        useState(false);

    const handleSelectList = (listId) => {
        setIsShoppingMode(false);
        listManagerProps.onSelectList(listId);
    };

    const listManager = !isShoppingMode ? (
        <ListManager
            {...listManagerProps}
            onSelectList={handleSelectList}
        />
    ) : null;

    return (
        <div className="flex flex-col gap-4">
            <ShoppingListHeader
                activeList={activeList}
                activeListId={activeListId}
                isShoppingMode={isShoppingMode}
                remainingCount={
                    shoppingList.remainingCount
                }
                completedCount={
                    shoppingList.completedCount
                }
                onToggleShoppingMode={() =>
                    setIsShoppingMode(
                        (current) => !current
                    )
                }
                listManager={listManager}
            />

            {!isShoppingMode && (
                <NewItemForm
                    onAddItem={
                        shoppingList.handleAddItem
                    }
                    suggestCategory={suggestCategory}
                    rememberCategoryPreference={
                        rememberCategoryPreference
                    }
                />
            )}

            <ItemList
                items={shoppingList.items}
                onDelete={
                    shoppingList.handleRemoveItem
                }
                onStatusChange={
                    shoppingList.handleItemStatusChange
                }
                onIncrement={
                    isShoppingMode
                        ? undefined
                        : shoppingList.handleChangeQuantity
                }
                onDecrement={
                    isShoppingMode
                        ? undefined
                        : shoppingList.handleChangeQuantity
                }
                onUpdate={
                    isShoppingMode
                        ? undefined
                        : shoppingList.handleUpdateItem
                }
                isShoppingMode={isShoppingMode}
            />

            <ShoppingListFooterActions
                isShoppingMode={isShoppingMode}
                hasCompletedItems={
                    shoppingList.hasCompletedItems
                }
                completedCount={
                    shoppingList.completedCount
                }
                showActionGroup={
                    shoppingList.showActionGroup
                }
                onExitShoppingMode={() =>
                    setIsShoppingMode(false)
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