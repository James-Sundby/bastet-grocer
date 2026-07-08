"use client";

import { useEffect, useState } from "react";
import { addToast } from "../components/atoms/toast";

import {
    getShoppingList,
    addItem,
    removeItem,
    updateItemStatus,
    deleteShoppingList,
    incrementDecrementItem,
    clearCompletedItems,
    updateItem,
} from "../_services/item-service";

export function useShoppingListPage({
    supabase,
    orgId,
    activeListId,
    setToasts,
    confirmModal,
    setConfirmModal,
    setIsConfirming,
}) {
    const [itemState, setItemState] = useState({
        status: "idle",
        queryKey: null,
        items: [],
    });

    const itemQueryKey =
        orgId && activeListId ? `${orgId}:${activeListId}` : null;

    const isCurrentQuery =
        Boolean(itemQueryKey) && itemState.queryKey === itemQueryKey;

    const isReady = isCurrentQuery && itemState.status === "success";
    const isLoading = Boolean(itemQueryKey) && !isCurrentQuery;
    const hasError = isCurrentQuery && itemState.status === "error";

    const items = isReady ? itemState.items : [];

    const completedCount = items.filter((item) => item.completed).length;
    const remainingCount = items.length - completedCount;
    const hasCompletedItems = completedCount > 0;
    const showActionGroup = items.length > 1;

    const updateItems = (updater) => {
        setItemState((currentState) => {
            if (
                currentState.queryKey !== itemQueryKey ||
                currentState.status !== "success"
            ) {
                return currentState;
            }

            const nextItems =
                typeof updater === "function"
                    ? updater(currentState.items)
                    : updater;

            return {
                ...currentState,
                items: nextItems,
            };
        });
    };

    useEffect(() => {
        if (!itemQueryKey || !activeListId) {
            return undefined;
        }

        let isCurrent = true;

        getShoppingList(supabase, activeListId)
            .then((loadedItems) => {
                if (!isCurrent) {
                    return;
                }

                setItemState({
                    status: "success",
                    queryKey: itemQueryKey,
                    items: loadedItems,
                });
            })
            .catch(() => {
                if (!isCurrent) {
                    return;
                }

                setItemState({
                    status: "error",
                    queryKey: itemQueryKey,
                    items: [],
                });

                addToast(setToasts, {
                    message: "There was a problem loading your shopping list.",
                    type: "Error",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, itemQueryKey, activeListId, setToasts]);

    const handleAddItem = async (item) => {
        if (!activeListId) {
            addToast(setToasts, {
                message: "Create or select a list before adding items.",
                type: "Error",
            });
            return;
        }

        try {
            const result = await addItem(supabase, orgId, activeListId, item);

            if (result.action === "updated") {
                updateItems((prevItems) =>
                    prevItems.map((currentItem) =>
                        currentItem.id === result.id
                            ? {
                                ...currentItem,
                                quantity: result.quantity,
                                note: result.note ?? currentItem.note ?? "",
                            }
                            : currentItem
                    )
                );

                addToast(setToasts, {
                    message: `${item.name} quantity updated to ${result.quantity}`,
                    type: "Success",
                });

                return;
            }

            const newItem = {
                ...item,
                id: result.id,
                quantity: result.quantity,
                note: result.note ?? item.note ?? "",
                completed: false,
            };

            updateItems((prevItems) => [...prevItems, newItem]);

            addToast(setToasts, {
                message: `${item.name} added`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem adding ${item.name} to your shopping list.`,
                type: "Error",
            });
        }
    };

    const handleRemoveItem = async (removedItem, event) => {
        event.stopPropagation();

        try {
            await removeItem(supabase, removedItem.id);

            updateItems((prevItems) =>
                prevItems.filter((item) => item.id !== removedItem.id)
            );

            addToast(setToasts, {
                message: `${removedItem.name} deleted`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem removing ${removedItem.name} from your shopping list.`,
                type: "Error",
            });
        }
    };

    const handleItemStatusChange = async (itemId, completed) => {
        try {
            await updateItemStatus(supabase, itemId, completed);

            updateItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, completed } : item
                )
            );
        } catch (error) {
            addToast(setToasts, {
                message: "There was a problem updating that item.",
                type: "Error",
            });
        }
    };

    const requestDeleteAll = () => {
        if (!items.length) {
            addToast(setToasts, {
                message: "Your shopping list is already empty.",
                type: "Info",
            });
            return;
        }

        setConfirmModal({
            type: "delete-all",
            title: "Delete all items?",
            message: "This will remove every item from your shopping list.",
            confirmLabel: "Delete All",
        });
    };

    const confirmDeleteAll = async () => {
        if (!activeListId) {
            return;
        }

        try {
            setIsConfirming(true);

            const deleted = await deleteShoppingList(supabase, activeListId);

            if (!deleted) {
                addToast(setToasts, {
                    message: "There was an error deleting your shopping list.",
                    type: "Error",
                });
                return;
            }

            updateItems([]);

            addToast(setToasts, {
                message: "Shopping list cleared",
                type: "Success",
            });

            setConfirmModal(null);
        } catch (error) {
            addToast(setToasts, {
                message: "There was a problem deleting your shopping list.",
                type: "Error",
            });
        } finally {
            setIsConfirming(false);
        }
    };

    const requestClearCompleted = () => {
        if (!completedCount) {
            addToast(setToasts, {
                message: "There are no completed items to clear.",
                type: "Info",
            });
            return;
        }

        setConfirmModal({
            type: "clear-completed",
            title: "Clear checked items?",
            message: `This will remove the ${completedCount} checked item${completedCount === 1 ? "" : "s"
                } from your shopping list.`,
            confirmLabel: `Clear Item${completedCount === 1 ? "" : "s"}`,
        });
    };

    const confirmClearCompleted = async () => {
        if (!activeListId) {
            return;
        }

        try {
            setIsConfirming(true);

            const deletedCount = await clearCompletedItems(supabase, activeListId);

            updateItems((prevItems) =>
                prevItems.filter((item) => !item.completed)
            );

            addToast(setToasts, {
                message: `${deletedCount} checked item${deletedCount === 1 ? "" : "s"
                    } cleared`,
                type: "Success",
            });

            setConfirmModal(null);
        } catch (error) {
            addToast(setToasts, {
                message: "There was a problem clearing checked items.",
                type: "Error",
            });
        } finally {
            setIsConfirming(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmModal) {
            return;
        }

        if (confirmModal.type === "delete-all") {
            await confirmDeleteAll();
            return;
        }

        if (confirmModal.type === "clear-completed") {
            await confirmClearCompleted();
        }
    };

    const handleIncrementDecrement = async (updatedItem, event, value) => {
        event.stopPropagation();

        try {
            const result = await incrementDecrementItem(
                supabase,
                updatedItem.id,
                value
            );

            updateItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === updatedItem.id
                        ? { ...item, quantity: result.quantity }
                        : item
                )
            );

            addToast(setToasts, {
                message: `${updatedItem.name} quantity updated to ${result.quantity}`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem updating ${updatedItem.name}.`,
                type: "Error",
            });
        }
    };

    const handleUpdateItem = async (itemId, updatedItem) => {
        try {
            const savedItem = await updateItem(supabase, itemId, updatedItem);

            updateItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, ...savedItem } : item
                )
            );

            addToast(setToasts, {
                message: `${savedItem.name} updated`,
                type: "Success",
            });

            return true;
        } catch (error) {
            addToast(setToasts, {
                message:
                    error.message === "An item with this name already exists."
                        ? error.message
                        : "There was a problem updating that item.",
                type: "Error",
            });

            return false;
        }
    };

    return {
        status: itemState.status,
        isReady,
        isLoading,
        hasError,
        items,
        completedCount,
        remainingCount,
        hasCompletedItems,
        showActionGroup,
        handleAddItem,
        handleRemoveItem,
        handleItemStatusChange,
        requestDeleteAll,
        requestClearCompleted,
        handleConfirmAction,
        handleIncrementDecrement,
        handleUpdateItem,
    };
}