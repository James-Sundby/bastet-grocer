"use client";

import { useEffect, useState } from "react";
import {
    addToast,
    getFriendlyErrorMessage,
} from "../components/atoms/toast";

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

function mapRealtimeItem(row) {
    return {
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        category: row.category,
        note: row.note ?? "",
        completed: row.completed,
        updatedAt: row.updated_at,
    };
}

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
        errorMessage: null,
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
                    errorMessage: null,
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
                    errorMessage:
                        "We couldn’t load your shopping list. Refresh the page and try again.",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, itemQueryKey, activeListId]);

    useEffect(() => {
        if (!itemQueryKey || !activeListId) {
            return undefined;
        }

        const channel = supabase
            .channel(`items:${activeListId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "items",
                    filter: `list_id=eq.${activeListId}`,
                },
                (payload) => {
                    setItemState((currentState) => {
                        if (
                            currentState.queryKey !== itemQueryKey ||
                            currentState.status !== "success"
                        ) {
                            return currentState;
                        }

                        if (payload.eventType === "INSERT") {
                            const nextItem = mapRealtimeItem(payload.new);

                            const alreadyExists = currentState.items.some(
                                (item) => item.id === nextItem.id
                            );

                            if (alreadyExists) {
                                return currentState;
                            }

                            return {
                                ...currentState,
                                items: [...currentState.items, nextItem],
                            };
                        }

                        if (payload.eventType === "UPDATE") {
                            const nextItem = mapRealtimeItem(payload.new);

                            return {
                                ...currentState,
                                items: currentState.items.map((item) =>
                                    item.id === nextItem.id
                                        ? { ...item, ...nextItem }
                                        : item
                                ),
                            };
                        }

                        if (payload.eventType === "DELETE") {
                            return {
                                ...currentState,
                                items: currentState.items.filter(
                                    (item) => item.id !== payload.old.id
                                ),
                            };
                        }

                        return currentState;
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, itemQueryKey, activeListId]);

    const handleAddItem = async (item) => {
        if (!activeListId) {
            addToast(setToasts, {
                title: "No list selected",
                message: "Create or select a list before adding items.",
                type: "warning",
            });
            return;
        }

        try {
            const savedItem = await addItem(supabase, orgId, activeListId, item);

            const wasExistingItem = items.some(
                (currentItem) => currentItem.id === savedItem.id
            );

            updateItems((prevItems) => {
                const itemAlreadyExists = prevItems.some(
                    (currentItem) => currentItem.id === savedItem.id
                );

                if (itemAlreadyExists) {
                    return prevItems.map((currentItem) =>
                        currentItem.id === savedItem.id
                            ? { ...currentItem, ...savedItem }
                            : currentItem
                    );
                }

                return [...prevItems, savedItem];
            });

            addToast(setToasts, {
                title: wasExistingItem ? "Quantity updated" : "Item added",
                message: wasExistingItem
                    ? `${savedItem.name} is now quantity ${savedItem.quantity}.`
                    : `${savedItem.name} was added to your list.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t add item",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your shopping list.`
                ),
                type: "error",
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
                title: "Item deleted",
                message: `${removedItem.name} was removed from your list.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t delete item",
                message: `There was a problem removing ${removedItem.name} from your shopping list.`,
                type: "error",
            });
        }
    };

    const handleItemStatusChange = async (itemId, completed) => {
        try {
            const result = await updateItemStatus(supabase, itemId, completed);

            updateItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId
                        ? {
                            ...item,
                            completed: result.completed,
                            updatedAt: result.updatedAt,
                        }
                        : item
                )
            );
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t update item",
                message: "There was a problem updating that item.",
                type: "error",
            });
        }
    };

    const requestDeleteAll = () => {
        if (!items.length) {
            addToast(setToasts, {
                title: "List already empty",
                message: "There are no items to delete.",
                type: "info",
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
                    title: "Couldn’t clear list",
                    message: "There was a problem deleting your shopping list.",
                    type: "error",
                });
                return;
            }

            updateItems([]);

            addToast(setToasts, {
                title: "Shopping list cleared",
                message: "All items were removed from your list.",
                type: "success",
            });

            setConfirmModal(null);
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t clear list",
                message: "There was a problem deleting your shopping list.",
                type: "error",
            });
        } finally {
            setIsConfirming(false);
        }
    };

    const requestClearCompleted = () => {
        if (!completedCount) {
            addToast(setToasts, {
                title: "Nothing to clear",
                message: "There are no checked items to clear.",
                type: "info",
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
                title: "Checked items cleared",
                message: `${deletedCount} checked item${deletedCount === 1 ? "" : "s"
                    } removed from your list.`,
                type: "success",
            });

            setConfirmModal(null);
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t clear checked items",
                message: "There was a problem clearing checked items.",
                type: "error",
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
                        ? {
                            ...item,
                            quantity: result.quantity,
                            updatedAt: result.updatedAt,
                        }
                        : item
                )
            );

            addToast(setToasts, {
                title: "Quantity updated",
                message: `${updatedItem.name} is now quantity ${result.quantity}.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t update quantity",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem updating ${updatedItem.name}.`
                ),
                type: "error",
            });
        }
    };

    const handleUpdateItem = async (itemId, updatedItem) => {
        try {
            const currentItem = items.find((item) => item.id === itemId);

            const savedItem = await updateItem(
                supabase,
                itemId,
                updatedItem,
                currentItem?.updatedAt
            );

            updateItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, ...savedItem } : item
                )
            );

            addToast(setToasts, {
                title: "Item updated",
                message: `${savedItem.name} was updated.`,
                type: "success",
            });

            return true;
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t update item",
                message: getFriendlyErrorMessage(
                    error,
                    "There was a problem updating that item."
                ),
                type: "error",
            });

            return false;
        }
    };

    return {
        status: itemState.status,
        isReady,
        isLoading,
        hasError,
        errorMessage: itemState.errorMessage,
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