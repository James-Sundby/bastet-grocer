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
    clearShoppingList,
    changeItemQuantity,
    clearCompletedItems,
    updateItem,
    mapItemRow,
} from "../_services/item-service";

export function useShoppingListPage({
    supabase,
    orgId,
    activeListId,
    initialListId = null,
    initialItems = null,
    setToasts,
    rememberCategoryPreference,
}) {
    const itemQueryKey =
        orgId && activeListId ? `${orgId}:${activeListId}` : null;

    const initialItemQueryKey =
        orgId && initialListId ? `${orgId}:${initialListId}` : null;

    const hasInitialItems =
        Boolean(itemQueryKey) &&
        itemQueryKey === initialItemQueryKey &&
        Array.isArray(initialItems);

    const [itemState, setItemState] = useState(() => ({
        status: hasInitialItems ? "success" : "idle",
        queryKey: hasInitialItems ? itemQueryKey : null,
        items: hasInitialItems ? initialItems : [],
        errorMessage: null,
    }));

    const status = !itemQueryKey
        ? "idle"
        : itemState.queryKey === itemQueryKey
            ? itemState.status
            : "loading";

    const isReady = status === "success";
    const isLoading = status === "loading";
    const hasError = status === "error";
    const errorMessage = hasError ? itemState.errorMessage : null;
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

    const notify = (toast) => {
        if (setToasts) addToast(setToasts, toast);
    };

    // Render server-provided initial data immediately, then silently
    // reconcile with the current database state.
    useEffect(() => {
        if (!itemQueryKey || !activeListId) return undefined;

        let isCurrent = true;

        const loadItems = async () => {
            try {
                const loadedItems = await getShoppingList(
                    supabase,
                    activeListId
                );

                if (!isCurrent) return;

                setItemState({
                    status: "success",
                    queryKey: itemQueryKey,
                    items: loadedItems,
                    errorMessage: null,
                });
            } catch {
                if (!isCurrent) return;

                setItemState((currentState) => {
                    // Keep already-rendered initial/current data if a
                    // background reconciliation happens to fail.
                    if (
                        currentState.queryKey === itemQueryKey &&
                        currentState.status === "success"
                    ) {
                        return currentState;
                    }

                    return {
                        status: "error",
                        queryKey: itemQueryKey,
                        items: [],
                        errorMessage:
                            "We couldn't load your shopping list. Refresh the page and try again.",
                    };
                });
            }
        };

        void loadItems();

        return () => {
            isCurrent = false;
        };
    }, [supabase, itemQueryKey, activeListId]);

    // Realtime keeps an already-loaded list synchronized while this
    // route is active.
    useEffect(() => {
        if (!itemQueryKey || !activeListId) return undefined;

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
                            const nextItem = mapItemRow(payload.new);
                            const alreadyExists = currentState.items.some(
                                (item) => item.id === nextItem.id
                            );

                            if (alreadyExists) return currentState;

                            return {
                                ...currentState,
                                items: [...currentState.items, nextItem],
                            };
                        }

                        if (payload.eventType === "UPDATE") {
                            const nextItem = mapItemRow(payload.new);

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
            notify({
                title: "No list selected",
                message: "Create or select a list before adding items.",
                type: "warning",
            });

            return false;
        }

        try {
            const savedItem = await addItem(
                supabase,
                orgId,
                activeListId,
                item
            );

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

            notify({
                title: wasExistingItem ? "Quantity updated" : "Item added",
                message: wasExistingItem
                    ? `${savedItem.name} is now quantity ${savedItem.quantity}.`
                    : `${savedItem.name} was added to your list.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn't add item",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem adding ${item.name} to your shopping list.`
                ),
                type: "error",
            });

            return false;
        }
    };

    const handleRemoveItem = async (removedItem) => {
        try {
            await removeItem(supabase, removedItem.id);

            updateItems((prevItems) =>
                prevItems.filter((item) => item.id !== removedItem.id)
            );

            notify({
                title: "Item deleted",
                message: `${removedItem.name} was removed from your list.`,
                type: "success",
            });

            return true;
        } catch {
            notify({
                title: "Couldn't delete item",
                message:
                    `There was a problem removing ${removedItem.name} from your shopping list.`,
                type: "error",
            });

            return false;
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
        } catch {
            notify({
                title: "Couldn't update item",
                message: "There was a problem updating that item.",
                type: "error",
            });
        }
    };

    const handleChangeQuantity = async (updatedItem, delta) => {
        try {
            const result = await changeItemQuantity(
                supabase,
                updatedItem.id,
                delta
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

            notify({
                title: "Quantity updated",
                message:
                    `${updatedItem.name} is now quantity ${result.quantity}.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn't update quantity",
                message: getFriendlyErrorMessage(
                    error,
                    `There was a problem updating ${updatedItem.name}.`
                ),
                type: "error",
            });

            return false;
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
                    item.id === itemId
                        ? { ...item, ...savedItem }
                        : item
                )
            );

            const nameChanged = currentItem?.name !== savedItem.name;
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
                title: "Item updated",
                message: `${savedItem.name} was updated.`,
                type: "success",
            });

            return true;
        } catch (error) {
            notify({
                title: "Couldn't update item",
                message: getFriendlyErrorMessage(
                    error,
                    "There was a problem updating that item."
                ),
                type: "error",
            });

            return false;
        }
    };

    const handleClearShoppingList = async () => {
        if (!activeListId || !items.length) return false;

        try {
            await clearShoppingList(supabase, activeListId);
            updateItems([]);

            notify({
                title: "Shopping list cleared",
                message: "All items were removed from your list.",
                type: "success",
            });

            return true;
        } catch {
            notify({
                title: "Couldn't clear list",
                message:
                    "There was a problem clearing your shopping list.",
                type: "error",
            });

            return false;
        }
    };

    const handleClearCompleted = async () => {
        if (!activeListId || !completedCount) return false;

        try {
            const deletedCount = await clearCompletedItems(
                supabase,
                activeListId
            );

            updateItems((prevItems) =>
                prevItems.filter((item) => !item.completed)
            );

            notify({
                title: "Checked items cleared",
                message:
                    `${deletedCount} checked item${deletedCount === 1 ? "" : "s"
                    } removed from your list.`,
                type: "success",
            });

            return true;
        } catch {
            notify({
                title: "Couldn't clear checked items",
                message:
                    "There was a problem clearing checked items.",
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
        completedCount,
        remainingCount,
        hasCompletedItems,
        showActionGroup,
        handleAddItem,
        handleRemoveItem,
        handleItemStatusChange,
        handleChangeQuantity,
        handleUpdateItem,
        handleClearShoppingList,
        handleClearCompleted,
    };
}