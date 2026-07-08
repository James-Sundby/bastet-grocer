"use client";

import { useEffect, useState } from "react";
import { createList, getLists } from "../_services/list-service";
import { addToast } from "../components/atoms/toast";

export function useActiveGroceryList({
    supabase,
    isLoaded,
    isSignedIn,
    orgId,
    requestedListId,
    setToasts,
}) {
    const [listState, setListState] = useState({
        status: "idle",
        queryKey: null,
        lists: [],
        activeListId: null,
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
                });

                addToast(setToasts, {
                    message: "There was a problem loading your lists.",
                    type: "Error",
                });
            });

        return () => {
            isCurrent = false;
        };
    }, [supabase, listQueryKey, orgId, requestedListId, setToasts]);

    return {
        status: listState.status,
        isReady,
        isLoading,
        hasError,
        lists,
        activeList,
        activeListId,
    };
}