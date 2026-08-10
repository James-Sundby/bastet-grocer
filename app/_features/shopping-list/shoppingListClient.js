"use client";

import { useState } from "react";

import { useSupabaseClient } from "@/app/_hooks/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useShoppingListPage } from "@/app/_hooks/useShoppingListPage";
import { useItemCategoryPreferences } from "@/app/_hooks/useItemCategoryPreferences";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import ShoppingListHeader from "@/app/components/organisms/shoppingListHeader";
import ShoppingListFooterActions from "@/app/components/organisms/shoppingListFooterActions";
import ListManager from "@/app/components/organisms/listManager";

import NewItemForm from "@/app/components/molecules/newItemForm";
import ItemList from "@/app/components/organisms/itemList";
import ConfirmModal from "@/app/components/molecules/confirmModal";
import Toast from "@/app/components/atoms/toast";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function ShoppingListClient({
    orgId,
    requestedListId,
    initialLists,
    initialActiveListId,
    initialItems,
}) {
    const supabase = useSupabaseClient();

    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] =
        useState(null);
    const [isConfirming, setIsConfirming] =
        useState(false);
    const [isShoppingMode, setIsShoppingMode] =
        useState(false);

    const {
        suggestCategory,
        rememberCategory: rememberCategoryPreference,
    } = useItemCategoryPreferences({
        supabase,
        orgId,
    });

    const {
        isReady: isListReady,
        hasError: hasListError,
        errorMessage: listErrorMessage,
        lists,
        activeList,
        activeListId,
        handleSelectList,
        handleCreateList,
        handleRenameList,
        handleDeleteList,
    } = useActiveGroceryList({
        supabase,
        orgId,
        requestedListId,
        initialLists,
        initialActiveListId,
        listPath: "/shopping-list",
        setToasts,
    });

    const shoppingList = useShoppingListPage({
        supabase,
        orgId,
        activeListId,
        initialListId: initialActiveListId,
        initialItems,
        setToasts,
        rememberCategoryPreference,
    });

    const handleManagedListSelect = (listId) => {
        setIsShoppingMode(false);
        handleSelectList(listId);
    };

    const listManager = !isShoppingMode ? (
        <ListManager
            lists={lists}
            activeList={activeList}
            activeListId={activeListId}
            onSelectList={handleManagedListSelect}
            onCreateList={handleCreateList}
            onRenameList={handleRenameList}
            onDeleteList={handleDeleteList}
        />
    ) : null;

    const requestDeleteAll = () => {
        setConfirmModal({
            type: "delete-all",
            title: "Delete all items?",
            message:
                "This will remove every item from your shopping list.",
            confirmLabel: "Delete All",
        });
    };

    const requestClearCompleted = () => {
        setConfirmModal({
            type: "clear-completed",
            title: "Clear checked items?",
            message:
                `This will remove the ${shoppingList.completedCount} checked item${shoppingList.completedCount === 1
                    ? ""
                    : "s"
                } from your shopping list.`,
            confirmLabel:
                `Clear Item${shoppingList.completedCount === 1
                    ? ""
                    : "s"
                }`,
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal) {
            return;
        }

        setIsConfirming(true);

        try {
            let succeeded = false;

            if (confirmModal.type === "delete-all") {
                succeeded =
                    await shoppingList.handleClearShoppingList();
            }

            if (
                confirmModal.type ===
                "clear-completed"
            ) {
                succeeded =
                    await shoppingList.handleClearCompleted();
            }

            if (succeeded) {
                setConfirmModal(null);
            }
        } finally {
            setIsConfirming(false);
        }
    };

    if (
        hasListError ||
        shoppingList.hasError
    ) {
        return (
            <>
                <GroceryPageShell>
                    <PageLoadAlert
                        title="Couldn’t load your shopping list"
                        message={
                            listErrorMessage ??
                            shoppingList.errorMessage ??
                            "Refresh the page and try again."
                        }
                    />
                </GroceryPageShell>

                <Toast toasts={toasts} />
            </>
        );
    }

    if (
        !isListReady ||
        !shoppingList.isReady
    ) {
        return <GroceryPageSkeleton />;
    }

    return (
        <>
            <GroceryPageShell>
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
                        suggestCategory={
                            suggestCategory
                        }
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
                        requestClearCompleted
                    }
                    onDeleteAll={
                        requestDeleteAll
                    }
                />
            </GroceryPageShell>

            <ConfirmModal
                isOpen={Boolean(confirmModal)}
                title={confirmModal?.title}
                message={confirmModal?.message}
                confirmLabel={
                    confirmModal?.confirmLabel
                }
                cancelLabel="Cancel"
                onConfirm={handleConfirmAction}
                onClose={() => {
                    if (!isConfirming) {
                        setConfirmModal(null);
                    }
                }}
                isLoading={isConfirming}
                variant="error"
            />

            <Toast toasts={toasts} />
        </>
    );
}