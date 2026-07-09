"use client";

import { useEffect, useState } from "react";
import {
    addToast,
    getFriendlyErrorMessage,
} from "../components/atoms/toast";

import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    incrementDecrementQuickAdd,
    updateQuickAddItem,
    addQuickAddToShoppingList,
} from "../_services/quick-add-service";

export function useQuickAddPage({
    supabase,
    orgId,
    userId,
    isLoaded,
    isSignedIn,
    activeListId,
    setToasts,
}) {
    const [quickAddState, setQuickAddState] = useState({
        status: "idle",
        queryKey: null,
        items: [],
        errorMessage: null,
    });

    const quickAddQueryKey =
        isLoaded && isSignedIn && userId ? userId : null;

    const isCurrentQuery =
        Boolean(quickAddQueryKey) &&
        quickAddState.queryKey === quickAddQueryKey;

    const isReady = isCurrentQuery && quickAddState.status === "success";
    const isLoading = Boolean(quickAddQueryKey) && !isCurrentQuery;
    const hasError = isCurrentQuery && quickAddState.status === "error";

    const items = isReady ? quickAddState.items : [];

    const updateQuickAddItems = (updater) => {
        setQuickAddState((currentState) => {
            if (
                currentState.queryKey !== quickAddQueryKey ||
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
        if (!quickAddQueryKey) {
            return undefined;
        }

        let isCurrent = true;

        getQuickAddItems(supabase)
            .then((loadedItems) => {
                if (!isCurrent) {
                    return;
                }

                setQuickAddState({
                    status: "success",
                    queryKey: quickAddQueryKey,
                    items: loadedItems,
                    errorMessage: null,
                });
            })
            .catch(() => {
                if (!isCurrent) {
                    return;
                }

                setQuickAddState({
                    status: "error",
                    queryKey: quickAddQueryKey,
                    items: [],
                    errorMessage:
                        "We couldn’t load your quick adds. Refresh the page and try again.",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, quickAddQueryKey]);

    const handleAddItem = async (item) => {
        try {
            const result = await addQuickAddItem(supabase, item);

            if (result.action === "updated") {
                updateQuickAddItems((prevItems) =>
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
                    title: "Quick add updated",
                    message: `${item.name} is now quantity ${result.quantity}.`,
                    type: "success",
                });

                return;
            }

            const newItem = {
                ...item,
                id: result.id,
                quantity: result.quantity,
                note: result.note ?? item.note ?? "",
            };

            updateQuickAddItems((prevItems) => [...prevItems, newItem]);

            addToast(setToasts, {
                title: "Quick add saved",
                message: `${item.name} was added to your quick adds.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t save quick add",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your quick adds.`
                ),
                type: "error",
            });
        }
    };

    const handleRemoveItem = async (removedItem, event) => {
        event.stopPropagation();

        try {
            await removeQuickAddItem(supabase, removedItem.id);

            updateQuickAddItems((prevItems) =>
                prevItems.filter((item) => item.id !== removedItem.id)
            );

            addToast(setToasts, {
                title: "Quick add deleted",
                message: `${removedItem.name} was removed from your quick adds.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t delete quick add",
                message: `There was a problem removing ${removedItem.name} from your quick adds.`,
                type: "error",
            });
        }
    };

    const handleIncrementDecrement = async (updatedItem, event, value) => {
        event.stopPropagation();

        try {
            const result = await incrementDecrementQuickAdd(
                supabase,
                updatedItem.id,
                value
            );

            updateQuickAddItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === updatedItem.id
                        ? { ...item, quantity: result.quantity }
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

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();

        if (!orgId || !activeListId) {
            addToast(setToasts, {
                title: "No shopping list selected",
                message: "Create or select a list before adding items.",
                type: "warning",
            });
            return;
        }

        try {
            const savedItem = await addQuickAddToShoppingList(
                supabase,
                item.id,
                activeListId
            );

            addToast(setToasts, {
                title: "Sent to shopping list",
                message: `${savedItem.name} was added to your shopping list.`,
                type: "success",
            });
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t send item",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your shopping list.`
                ),
                type: "error",
            });
        }
    };

    const handleUpdateQuickAddItem = async (itemId, updatedItem) => {
        try {
            const savedItem = await updateQuickAddItem(
                supabase,
                itemId,
                updatedItem
            );

            updateQuickAddItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId ? { ...item, ...savedItem } : item
                )
            );

            addToast(setToasts, {
                title: "Quick add updated",
                message: `${savedItem.name} was updated.`,
                type: "success",
            });

            return true;
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t update quick add",
                message: getFriendlyErrorMessage(
                    error,
                    "There was a problem updating that quick add."
                ),
                type: "error",
            });

            return false;
        }
    };

    return {
        status: quickAddState.status,
        isReady,
        isLoading,
        hasError,
        errorMessage: quickAddState.errorMessage,
        items,
        handleAddItem,
        handleRemoveItem,
        handleIncrementDecrement,
        handleAddToShoppingList,
        handleUpdateQuickAddItem,
    };
}