"use client";

import { useEffect, useState } from "react";
import { createList, getLists } from "../_services/list-service";

export function useActiveGroceryList({
    supabase,
    isLoaded,
    isSignedIn,
    orgId,
    requestedListId,
}) {
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

    return {
        status: listState.status,
        isReady,
        isLoading,
        hasError,
        errorMessage: listState.errorMessage,
        lists,
        activeList,
        activeListId,
    };
}