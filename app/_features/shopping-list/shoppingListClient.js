"use client";

import { useState } from "react";

import { useSupabaseClient } from "@/app/_hooks/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useShoppingListPage } from "@/app/_hooks/useShoppingListPage";
import { useItemCategoryPreferences } from "@/app/_hooks/useItemCategoryPreferences";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import MobileShoppingListView from "./mobileShoppingListView";
import DesktopShoppingListView from "./desktopShoppingListView";

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

    const listManagerProps = {
        lists,
        activeList,
        activeListId,
        onSelectList: handleSelectList,
        onCreateList: handleCreateList,
        onRenameList: handleRenameList,
        onDeleteList: handleDeleteList,
    };

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
            <GroceryPageShell width="shopping" desktopMode="workspace">
                <div className="w-full lg:hidden">
                    <MobileShoppingListView
                        activeList={activeList}
                        activeListId={activeListId}
                        listManagerProps={
                            listManagerProps
                        }
                        shoppingList={shoppingList}
                        suggestCategory={
                            suggestCategory
                        }
                        rememberCategoryPreference={
                            rememberCategoryPreference
                        }
                        onRequestClearCompleted={
                            requestClearCompleted
                        }
                        onRequestDeleteAll={
                            requestDeleteAll
                        }
                    />
                </div>

                <div className="hidden min-h-0 w-full flex-1 lg:block">
                    <DesktopShoppingListView
                        activeList={activeList}
                        activeListId={activeListId}
                        listManagerProps={
                            listManagerProps
                        }
                        shoppingList={shoppingList}
                        suggestCategory={
                            suggestCategory
                        }
                        rememberCategoryPreference={
                            rememberCategoryPreference
                        }
                        onRequestClearCompleted={
                            requestClearCompleted
                        }
                        onRequestDeleteAll={
                            requestDeleteAll
                        }
                    />
                </div>
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