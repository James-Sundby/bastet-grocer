"use client";

import { useState } from "react";

import ShoppingListHeader from "@/app/components/organisms/shoppingListHeader";
import ListManager from "@/app/components/organisms/listManager";
import ItemList from "@/app/components/organisms/itemList";
import NewItemForm from "@/app/components/molecules/newItemForm";
import ClearCompletedButton from "@/app/components/atoms/clearCompletedButton";
import DeleteAllButton from "@/app/components/atoms/deleteAllButton";

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
    const [isShoppingMode, setIsShoppingMode] = useState(false);

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
                remainingCount={shoppingList.remainingCount}
                completedCount={shoppingList.completedCount}
                onToggleShoppingMode={() =>
                    setIsShoppingMode((current) => !current)
                }
                listManager={listManager}
            />

            {!isShoppingMode && (
                <NewItemForm
                    onAddItem={shoppingList.handleAddItem}
                    suggestCategory={suggestCategory}
                    rememberCategoryPreference={rememberCategoryPreference}
                />
            )}

            <ItemList
                items={shoppingList.items}
                variant={isShoppingMode ? "shopping" : "list"}
                onDelete={shoppingList.handleRemoveItem}
                onStatusChange={shoppingList.handleItemStatusChange}
                onIncrement={shoppingList.handleChangeQuantity}
                onDecrement={shoppingList.handleChangeQuantity}
                onUpdate={shoppingList.handleUpdateItem}
            />

            {shoppingList.showActionGroup && (
                <div className="mt-auto w-full max-w-xl pt-8">
                    {shoppingList.hasCompletedItems ? (
                        <div className="grid grid-cols-2 gap-3">
                            <ClearCompletedButton
                                onClearCompleted={onRequestClearCompleted}
                                count={shoppingList.completedCount}
                            />

                            <DeleteAllButton
                                onDeleteAll={onRequestDeleteAll}
                            />
                        </div>
                    ) : (
                        <DeleteAllButton
                            onDeleteAll={onRequestDeleteAll}
                        />
                    )}
                </div>
            )}
        </div>
    );
}