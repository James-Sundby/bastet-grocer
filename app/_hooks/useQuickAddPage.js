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
    changeQuickAddQuantity,
    updateQuickAddItem,
    addQuickAddToShoppingList,
} from "../_services/quick-add-service";

export function useQuickAddPage({
    supabase,
    orgId,
    userId,
    activeListId,
    initialUserId = null,
    initialItems = null,
    setToasts,
    rememberCategoryPreference,
    activeListTitle,
}) {
    const quickAddQueryKey =
        userId ?? null;

    const initialQuickAddQueryKey =
        initialUserId ?? null;

    const hasInitialItems =
        Boolean(quickAddQueryKey) &&
        quickAddQueryKey === initialQuickAddQueryKey &&
        Array.isArray(initialItems);

    const [quickAddState, setQuickAddState] =
        useState(() => ({
            status: hasInitialItems
                ? "success"
                : "idle",
            queryKey: hasInitialItems
                ? quickAddQueryKey
                : null,
            items: hasInitialItems
                ? initialItems
                : [],
            errorMessage: null,
        }));

    const status = !quickAddQueryKey
        ? "idle"
        : quickAddState.queryKey === quickAddQueryKey
            ? quickAddState.status
            : "loading";

    const isReady = status === "success";
    const isLoading = status === "loading";
    const hasError = status === "error";

    const items = isReady
        ? quickAddState.items
        : [];

    const errorMessage = hasError
        ? quickAddState.errorMessage
        : null;

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

    const notify = (toast) => {
        if (setToasts) {
            addToast(setToasts, toast);
        }
    };

    useEffect(() => {
        if (
            !quickAddQueryKey ||
            quickAddState.queryKey === quickAddQueryKey
        ) {
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
    }, [
        supabase,
        quickAddQueryKey,
        quickAddState.queryKey,
    ]);

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
                                note:
                                    result.note ??
                                    currentItem.note ??
                                    "",
                            }
                            : currentItem
                    )
                );

                notify({
                    title: "Quick add updated",
                    message: `${item.name} is now quantity ${result.quantity}.`,
                    type: "success",
                });

                return true;
            }

            const newItem = {
                ...item,
                id: result.id,
                quantity: result.quantity,
                note: result.note ?? item.note ?? "",
            };

            updateQuickAddItems((prevItems) => [
                ...prevItems,
                newItem,
            ]);

            notify({
                title: "Quick add saved",
                message: `${item.name} was added to your quick adds.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn't save quick add",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your quick adds.`
                ),
                type: "error",
            });

            return false;
        }
    };

    const handleRemoveItem = async (removedItem) => {
        try {
            await removeQuickAddItem(
                supabase,
                removedItem.id
            );

            updateQuickAddItems((prevItems) =>
                prevItems.filter(
                    (item) =>
                        item.id !== removedItem.id
                )
            );

            notify({
                title: "Quick add deleted",
                message:
                    `${removedItem.name} was removed from your quick adds.`,
                type: "success",
            });

            return true;
        } catch {
            notify({
                title: "Couldn’t delete quick add",
                message:
                    `There was a problem removing ${removedItem.name} from your quick adds.`,
                type: "error",
            });

            return false;
        }
    };

    const handleChangeQuantity = async (
        updatedItem,
        delta
    ) => {
        try {
            const result =
                await changeQuickAddQuantity(
                    supabase,
                    updatedItem.id,
                    delta
                );

            updateQuickAddItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === updatedItem.id
                        ? {
                            ...item,
                            quantity: result.quantity,
                        }
                        : item
                )
            );

            notify({
                title: "Quantity updated",
                message:
                    `${updatedItem.name} is now quantity ${result.quantity}.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn’t update quantity",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem updating ${updatedItem.name}.`
                ),
                type: "error",
            });

            return false;
        }
    };

    const handleAddToShoppingList = async (item) => {
        if (!orgId || !activeListId) {
            notify({
                title: "No shopping list selected",
                message:
                    "Create or select a list before adding items.",
                type: "warning",
            });

            return false;
        }

        try {
            const savedItem =
                await addQuickAddToShoppingList(
                    supabase,
                    item.id,
                    activeListId
                );

            notify({
                title: "Sent to shopping list",
                message: activeListTitle
                    ? `${savedItem.name} was added to ${activeListTitle}.`
                    : `${savedItem.name} was added to your shopping list.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn’t send item",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your shopping list.`
                ),
                type: "error",
            });

            return false;
        }
    };

    const handleUpdateQuickAddItem = async (
        itemId,
        updatedItem
    ) => {
        try {
            const currentItem = items.find(
                (item) => item.id === itemId
            );

            const savedItem = await updateQuickAddItem(
                supabase,
                itemId,
                updatedItem
            );

            updateQuickAddItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId
                        ? { ...item, ...savedItem }
                        : item
                )
            );

            const nameChanged =
                currentItem?.name !== savedItem.name;

            const categoryChanged =
                currentItem?.category !== savedItem.category;

            if (nameChanged || categoryChanged) {
                void rememberCategoryPreference?.({
                    name: savedItem.name,
                    category: savedItem.category,
                    force: true,
                });
            }

            notify({
                title: "Quick add updated",
                message: `${savedItem.name} was updated.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
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
        status,
        isReady,
        isLoading,
        hasError,
        errorMessage,
        items,
        handleAddItem,
        handleRemoveItem,
        handleChangeQuantity,
        handleAddToShoppingList,
        handleUpdateQuickAddItem,
    };
}