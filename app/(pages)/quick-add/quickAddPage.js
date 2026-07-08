"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
    CreateOrganization,
    OrganizationSwitcher,
    RedirectToSignIn,
    useAuth,
} from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

import { useSupabaseClient } from "@/app/_utils/useSupabaseClient";

import { addItem } from "../../_services/item-service";

import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    incrementDecrementQuickAdd,
    updateQuickAddItem,
} from "../../_services/quick-add-service";

import {
    getLists,
    createList,
} from "../../_services/list-service";

import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import Toast, { addToast } from "../../components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function QuickAddPage() {
    return (
        <Suspense fallback={<GroceryPageSkeleton />}>
            <QuickAddPageContent />
        </Suspense>
    );
}

function QuickAddPageContent() {
    const supabase = useSupabaseClient();
    const searchParams = useSearchParams();
    const { isLoaded, isSignedIn, orgId } = useAuth();

    const requestedListId = searchParams.get("list");

    const [items, setItems] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [activeListId, setActiveListId] = useState(null);
    const [isListsLoading, setIsListsLoading] = useState(false);
    const [isQuickAddsLoading, setIsQuickAddsLoading] = useState(false);
    const [hasLoadedLists, setHasLoadedLists] = useState(false);
    const [hasLoadedQuickAdds, setHasLoadedQuickAdds] = useState(false);

    useEffect(() => {
        if (isLoaded && (!isSignedIn || !orgId)) {
            setActiveListId(null);
            setHasLoadedLists(false);
        }
    }, [isLoaded, isSignedIn, orgId]);

    useEffect(() => {
        const loadLists = async () => {
            try {
                setIsListsLoading(true);
                setHasLoadedLists(false);

                const loadedLists = await getLists(supabase);

                if (loadedLists.length === 0) {
                    const newList = await createList(supabase, orgId, "Shopping List");

                    setActiveListId(newList.id);
                    return;
                }

                const requestedList = loadedLists.find(
                    (list) => list.id === requestedListId
                );

                setActiveListId(requestedList?.id ?? loadedLists[0].id);
            } catch (error) {
                addToast(setToasts, {
                    message: "There was a problem loading your lists.",
                    type: "Error",
                });
            } finally {
                setIsListsLoading(false);
                setHasLoadedLists(true);
            }
        };

        if (isLoaded && isSignedIn && orgId) {
            loadLists();
        }
    }, [supabase, isLoaded, isSignedIn, orgId, requestedListId]);

    useEffect(() => {
        const loadQuickAdds = async () => {
            try {
                setIsQuickAddsLoading(true);
                setHasLoadedQuickAdds(false);

                const loadedItems = await getQuickAddItems(supabase);
                setItems(loadedItems);
            } catch (error) {
                addToast(setToasts, {
                    message: "There was a problem loading your quick adds.",
                    type: "Error",
                });
            } finally {
                setIsQuickAddsLoading(false);
                setHasLoadedQuickAdds(true);
            }
        };

        if (isLoaded && isSignedIn) {
            loadQuickAdds();
        }
    }, [supabase, isLoaded, isSignedIn]);

    const handleAddItem = async (item) => {
        try {
            const result = await addQuickAddItem(supabase, item);

            if (result.action === "updated") {
                setItems((prevItems) =>
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

            setItems((prevItems) => [...prevItems, newItem]);

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

            setItems((prevItems) =>
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

            setItems((prevItems) =>
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

        if (!activeListId) {
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

            const result = await addItem(supabase, orgId, activeListId, newItem);

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

            setItems((prevItems) =>
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

    if (!isLoaded) {
        return <GroceryPageSkeleton />;
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }

    if (!orgId) {
        return (
            <main
                className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
                role="main"
            >
                <section className="w-full max-w-xl rounded-md border border-base-300 bg-base-100 p-6 text-center">
                    <h1 className="text-3xl font-bold">Create a Household</h1>

                    <p className="mt-2 text-sm text-base-content/75">
                        Create or select a household before using shared grocery lists.
                    </p>

                    <div className="mt-6 flex justify-center">
                        <CreateOrganization
                            afterCreateOrganizationUrl="/quick-add"
                            skipInvitationScreen={false}
                        />
                    </div>

                    <div className="mt-6 border-t border-base-300 pt-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-base-content/60">
                            Already have one?
                        </p>

                        <div className="flex justify-center">
                            <OrganizationSwitcher
                                afterCreateOrganizationUrl="/quick-add"
                                afterSelectOrganizationUrl="/quick-add"
                            />
                        </div>
                    </div>
                </section>

                <Toast toasts={toasts} />
            </main>
        );
    }

    if (
        !hasLoadedLists ||
        !hasLoadedQuickAdds ||
        isListsLoading ||
        isQuickAddsLoading
    ) {
        return <GroceryPageSkeleton />;
    }

    return (
        <main
            className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
            role="main"
        >
            <div className="flex w-full max-w-xl flex-col items-center gap-4">
                <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
                    <h1 className="text-3xl font-bold">Quick Add Items</h1>

                    <p className="mt-2 text-sm text-base-content/75">
                        Save groceries you buy often, then add them to your shopping list
                        with one tap.
                    </p>

                    <div className="mt-4">
                        <Link
                            href={
                                activeListId
                                    ? `/shopping-list?list=${activeListId}`
                                    : "/shopping-list"
                            }
                            className="btn btn-outline h-auto px-4 py-2"
                        >
                            Back to Shopping List
                        </Link>
                    </div>
                </section>

                <NewItemForm onAddItem={handleAddItem} isQuickAdd />

                <ItemList
                    items={items}
                    onDelete={handleRemoveItem}
                    onAdd={handleAddToShoppingList}
                    isQuickAdd
                    onIncrement={handleIncrementDecrement}
                    onDecrement={handleIncrementDecrement}
                    onUpdate={handleUpdateQuickAddItem}
                />

                <Toast toasts={toasts} />
            </div>
        </main>
    );
}