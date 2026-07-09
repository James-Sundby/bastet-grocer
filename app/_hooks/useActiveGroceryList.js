"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { addToast } from "../components/atoms/toast";
import {
    createList,
    deleteList,
    getLists,
    renameList,
} from "../_services/list-service";

export function useActiveGroceryList({
    supabase,
    isLoaded,
    isSignedIn,
    orgId,
    requestedListId,
    setToasts,
}) {
    const router = useRouter();

    const [listState, setListState] = useState({
        status: "idle",
        queryKey: null,
        lists: [],
        activeListId: null,
        errorMessage: null,
    });

    const listQueryKey =
        isLoaded && isSignedIn && orgId
            ? `${orgId}:${requestedListId ?? ""}`
            : null;

    const isCurrentQuery =
        Boolean(listQueryKey) && listState.queryKey === listQueryKey;

    const isReady = isCurrentQuery && listState.status === "success";
    const isLoading = Boolean(listQueryKey) && !isCurrentQuery;
    const hasError = isCurrentQuery && listState.status === "error";

    const lists = isReady ? listState.lists : [];
    const activeListId = isReady ? listState.activeListId : null;
    const activeList =
        lists.find((list) => list.id === activeListId) ?? null;

    useEffect(() => {
        if (!listQueryKey || !orgId) {
            return undefined;
        }

        let isCurrent = true;

        getLists(supabase)
            .then(async (loadedLists) => {
                if (!isCurrent) {
                    return;
                }

                if (loadedLists.length === 0) {
                    const newList = await createList(
                        supabase,
                        orgId,
                        "Shopping List"
                    );

                    if (!isCurrent) {
                        return;
                    }

                    setListState({
                        status: "success",
                        queryKey: listQueryKey,
                        lists: [newList],
                        activeListId: newList.id,
                        errorMessage: null,
                    });

                    return;
                }

                const requestedList = loadedLists.find(
                    (list) => list.id === requestedListId
                );

                setListState({
                    status: "success",
                    queryKey: listQueryKey,
                    lists: loadedLists,
                    activeListId: requestedList?.id ?? loadedLists[0].id,
                    errorMessage: null,
                });
            })
            .catch(() => {
                if (!isCurrent) {
                    return;
                }

                setListState({
                    status: "error",
                    queryKey: listQueryKey,
                    lists: [],
                    activeListId: null,
                    errorMessage:
                        "We couldn’t load your household lists. Refresh the page and try again.",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, listQueryKey, orgId, requestedListId]);

    const handleSelectList = (listId) => {
        if (!listId || listId === activeListId) {
            return;
        }

        router.replace(`/shopping-list?list=${listId}`);
    };

    const handleCreateList = async (title) => {
        if (!orgId) {
            addToast(setToasts, {
                title: "No household selected",
                message: "Create or select a household before creating lists.",
                type: "warning",
            });
            return null;
        }

        try {
            const newList = await createList(supabase, orgId, title);

            setListState((currentState) => {
                if (
                    currentState.queryKey !== listQueryKey ||
                    currentState.status !== "success"
                ) {
                    return currentState;
                }

                return {
                    ...currentState,
                    lists: [...currentState.lists, newList],
                    activeListId: newList.id,
                };
            });

            router.replace(`/shopping-list?list=${newList.id}`);

            addToast(setToasts, {
                title: "List created",
                message: `${newList.title} is ready.`,
                type: "success",
            });

            return newList;
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t create list",
                message:
                    error.message ||
                    "There was a problem creating your shopping list.",
                type: "error",
            });

            return null;
        }
    };

    const handleRenameList = async (listId, title) => {
        try {
            const renamedList = await renameList(supabase, listId, title);

            setListState((currentState) => {
                if (
                    currentState.queryKey !== listQueryKey ||
                    currentState.status !== "success"
                ) {
                    return currentState;
                }

                return {
                    ...currentState,
                    lists: currentState.lists.map((list) =>
                        list.id === listId ? renamedList : list
                    ),
                    activeListId: currentState.activeListId,
                };
            });

            addToast(setToasts, {
                title: "List renamed",
                message: `This list is now called ${renamedList.title}.`,
                type: "success",
            });

            return renamedList;
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t rename list",
                message:
                    error.message ||
                    "There was a problem renaming your shopping list.",
                type: "error",
            });

            return null;
        }
    };

    const handleDeleteList = async (listId) => {
        if (lists.length <= 1) {
            addToast(setToasts, {
                title: "Can’t delete only list",
                message: "Every household needs at least one shopping list.",
                type: "warning",
            });

            return null;
        }

        const deletedList = lists.find((list) => list.id === listId);

        try {
            await deleteList(supabase, listId);

            const remainingLists = lists.filter((list) => list.id !== listId);
            const nextActiveListId =
                activeListId === listId
                    ? remainingLists[0]?.id
                    : activeListId;

            setListState((currentState) => {
                if (
                    currentState.queryKey !== listQueryKey ||
                    currentState.status !== "success"
                ) {
                    return currentState;
                }

                return {
                    ...currentState,
                    lists: remainingLists,
                    activeListId: nextActiveListId,
                };
            });

            if (activeListId === listId && nextActiveListId) {
                router.replace(`/shopping-list?list=${nextActiveListId}`);
            }

            addToast(setToasts, {
                title: "List deleted",
                message: `${deletedList?.title ?? "The list"} was deleted.`,
                type: "success",
            });

            return listId;
        } catch (error) {
            addToast(setToasts, {
                title: "Couldn’t delete list",
                message:
                    error.message ||
                    "There was a problem deleting your shopping list.",
                type: "error",
            });

            return null;
        }
    };

    return {
        status: listState.status,
        isReady,
        isLoading,
        hasError,
        errorMessage: listState.errorMessage,
        lists,
        activeList,
        activeListId,
        handleSelectList,
        handleCreateList,
        handleRenameList,
        handleDeleteList,
    };
}