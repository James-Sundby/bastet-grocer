"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	createList,
	deleteList,
	getLists,
	renameList,
} from "../_services/list-service";
import { addToast } from "../components/atoms/toast";

function buildListUrl(listPath, listId) {
	return `${listPath}?list=${listId}`;
}

export function useActiveGroceryList({
	supabase,
	orgId,
	requestedListId,
	initialLists = null,
	initialActiveListId = null,
	listPath = "/shopping-list",
	setToasts,
}) {
	const router = useRouter();
	const requestedListIdRef = useRef(requestedListId);

	const listQueryKey = orgId ?? null;

	const hasInitialLists =
		Boolean(listQueryKey) &&
		Array.isArray(initialLists) &&
		initialLists.length > 0;

	const resolvedInitialActiveListId =
		hasInitialLists &&
		initialLists.some((list) => list.id === initialActiveListId)
			? initialActiveListId
			: hasInitialLists
				? initialLists[0].id
				: null;

	const [listState, setListState] = useState(() => ({
		status: hasInitialLists ? "success" : "idle",
		queryKey: hasInitialLists ? listQueryKey : null,
		lists: hasInitialLists ? initialLists : [],
		activeListId: resolvedInitialActiveListId,
		errorMessage: null,
	}));

	useEffect(() => {
		requestedListIdRef.current = requestedListId;
	}, [requestedListId]);

	const status = !listQueryKey
		? "idle"
		: listState.queryKey === listQueryKey
			? listState.status
			: "loading";

	const isReady = status === "success";
	const isLoading = status === "loading";
	const hasError = status === "error";

	const lists = isReady ? listState.lists : [];

	const activeListId = isReady ? listState.activeListId : null;

	const activeList = lists.find((list) => list.id === activeListId) ?? null;

	const errorMessage = hasError ? listState.errorMessage : null;

	const notify = (toast) => {
		if (setToasts) {
			addToast(setToasts, toast);
		}
	};

	const setActiveList = useCallback(
		(listId) => {
			setListState((currentState) => {
				if (
					currentState.queryKey !== listQueryKey ||
					currentState.status !== "success" ||
					!currentState.lists.some((list) => list.id === listId)
				) {
					return currentState;
				}

				if (currentState.activeListId === listId) {
					return currentState;
				}

				return {
					...currentState,
					activeListId: listId,
				};
			});
		},
		[listQueryKey],
	);

	useEffect(() => {
		if (!listQueryKey || !orgId || listState.queryKey === listQueryKey) {
			return undefined;
		}

		let isCurrent = true;

		getLists(supabase)
			.then(async (loadedLists) => {
				if (!isCurrent) {
					return;
				}

				if (loadedLists.length === 0) {
					const newList = await createList(supabase, orgId, "Shopping List");

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
					(list) => list.id === requestedListIdRef.current,
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
						"We couldn't load your household lists. Refresh the page and try again.",
				});
			});

		return () => {
			isCurrent = false;
		};
	}, [supabase, listQueryKey, orgId, listState.queryKey]);

	useEffect(() => {
		if (!listQueryKey || !orgId) {
			return undefined;
		}

		let isCurrent = true;

		const refreshLists = async () => {
			try {
				const loadedLists = await getLists(supabase);

				if (!isCurrent) {
					return;
				}

				setListState((currentState) => {
					if (
						currentState.queryKey !== listQueryKey ||
						currentState.status !== "success"
					) {
						return currentState;
					}

					const activeStillExists = loadedLists.some(
						(list) => list.id === currentState.activeListId,
					);

					return {
						...currentState,
						lists: loadedLists,
						activeListId: activeStillExists
							? currentState.activeListId
							: (loadedLists[0]?.id ?? null),
						errorMessage: null,
					};
				});
			} catch {
				// Background realtime sync failure should not
				// replace already-loaded page data.
			}
		};

		const channel = supabase
			.channel(`lists:${orgId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "lists",
					filter: `org_id=eq.${orgId}`,
				},
				refreshLists,
			)
			.subscribe();

		return () => {
			isCurrent = false;
			supabase.removeChannel(channel);
		};
	}, [supabase, listQueryKey, orgId]);

	useEffect(() => {
		if (!isReady || !requestedListId) {
			return;
		}

		const requestedListExists = lists.some(
			(list) => list.id === requestedListId,
		);

		if (requestedListExists) {
			if (requestedListId !== activeListId) {
				setActiveList(requestedListId);
			}

			return;
		}

		if (activeListId) {
			router.replace(buildListUrl(listPath, activeListId));
		}
	}, [
		isReady,
		lists,
		activeListId,
		requestedListId,
		router,
		listPath,
		setActiveList,
	]);

	const handleSelectList = (listId) => {
		if (!listId || listId === activeListId) {
			return;
		}

		setActiveList(listId);
		router.replace(buildListUrl(listPath, listId));
	};

	const handleCreateList = async (title) => {
		if (!orgId) {
			notify({
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

			router.replace(buildListUrl(listPath, newList.id));

			notify({
				title: "List created",
				message: `${newList.title} is ready.`,
				type: "success",
			});

			return newList;
		} catch (error) {
			notify({
				title: "Couldn't create list",
				message:
					error.message || "There was a problem creating your shopping list.",
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
						list.id === listId ? renamedList : list,
					),
				};
			});

			notify({
				title: "List renamed",
				message: `This list is now called ${renamedList.title}.`,
				type: "success",
			});

			return renamedList;
		} catch (error) {
			notify({
				title: "Couldn't rename list",
				message:
					error.message || "There was a problem renaming your shopping list.",
				type: "error",
			});

			return null;
		}
	};

	const handleDeleteList = async (listId) => {
		if (lists.length <= 1) {
			notify({
				title: "Can't delete only list",
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
					? (remainingLists[0]?.id ?? null)
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
				router.replace(buildListUrl(listPath, nextActiveListId));
			}

			notify({
				title: "List deleted",
				message: `${deletedList?.title ?? "The list"} was deleted.`,
				type: "success",
			});

			return listId;
		} catch (error) {
			notify({
				title: "Couldn't delete list",
				message:
					error.message || "There was a problem deleting your shopping list.",
				type: "error",
			});

			return null;
		}
	};

	return {
		status,
		isReady,
		isLoading,
		hasError,
		errorMessage,
		lists,
		activeList,
		activeListId,
		handleSelectList,
		handleCreateList,
		handleRenameList,
		handleDeleteList,
	};
}
