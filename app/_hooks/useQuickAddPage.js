"use client";

import { useEffect, useState } from "react";
import { addToast } from "../components/atoms/toast";

import { addItem } from "../_services/item-service";

import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    incrementDecrementQuickAdd,
    updateQuickAddItem,
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
                });

                addToast(setToasts, {
                    message: "There was a problem loading your quick adds.",
                    type: "Error",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, quickAddQueryKey, setToasts]);

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
                    message: `${item.name} quick add quantity updated to ${result.quantity}`,
                    type: "Success",
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
                message: `${item.name} added to quick adds`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem adding ${item.name} to your quick adds.`,
                type: "Error",
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
                message: `${removedItem.name} deleted`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem removing ${removedItem.name} from your quick adds.`,
                type: "Error",
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

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();

        if (!orgId || !activeListId) {
            addToast(setToasts, {
                message: "Create or select a list before adding items.",
                type: "Error",
            });
            return;
        }

        try {
            const newItem = {
                name: item.name,
                quantity: item.quantity,
                category: item.category,
                note: item.note ?? "",
                completed: false,
            };

            const result = await addItem(
                supabase,
                orgId,
                activeListId,
                newItem
            );

            addToast(setToasts, {
                message:
                    result.action === "updated"
                        ? `${item.name} shopping list quantity updated to ${result.quantity}`
                        : `${item.name} added to shopping list`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem adding ${item.name} to your shopping list.`,
                type: "Error",
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
                message: `${savedItem.name} updated`,
                type: "Success",
            });

            return true;
        } catch (error) {
            addToast(setToasts, {
                message:
                    error.message === "An item with this name already exists."
                        ? error.message
                        : "There was a problem updating that quick add.",
                type: "Error",
            });

            return false;
        }
    };

    return {
        status: quickAddState.status,
        isReady,
        isLoading,
        hasError,
        items,
        handleAddItem,
        handleRemoveItem,
        handleIncrementDecrement,
        handleAddToShoppingList,
        handleUpdateQuickAddItem,
    };
}