"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    addItem,
    incrementDecrementQuickAdd,
    updateQuickAddItem
} from "../../_services/shopping-list-service";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import Toast, { addToast } from "../../components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function QuickAddPage() {
    const { user, loading } = useUserAuth();
    const [items, setItems] = useState([]);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const items = await getQuickAddItems(user.uid);
                setItems(items);
            } catch (error) {
                // console.error("Error retrieving quick add items: ", error);
                addToast(setToasts, {
                    message: "There was a problem loading your shopping list.",
                    type: "Error",
                });
            }
        };

        if (user) {
            loadItems();
        }
    }, [user]);

    if (loading) {
        return <GroceryPageSkeleton />;
    }

    if (!user) {
        notFound();
    }

    const handleAddItem = async (item) => {
        try {
            const result = await addQuickAddItem(user.uid, item);

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
            await removeQuickAddItem(user.uid, removedItem.id);
            setItems((prevItems) => prevItems.filter((item) => item.id !== removedItem.id));

            addToast(setToasts, {
                message: `${removedItem.name} deleted`,
                type: "Success",
            });

        } catch (error) {
            // console.error("Error removing item: ", error);

            addToast(setToasts, {
                message: `There was a problem removing ${removedItem.name} from your quick adds.`,
                type: "Error",
            });

        }
    };

    const handleIncrementDecrement = async (updateItem, event, value) => {
        event.stopPropagation();

        try {
            await incrementDecrementQuickAdd(user.uid, updateItem.id, value);

            const updatedItems = [...items];
            const itemIndex = updatedItems.findIndex(
                (item) => item.id === updateItem.id
            );

            if (itemIndex === -1) {
                return;
            }

            updatedItems[itemIndex].quantity += value;
            const newItemValue = updatedItems[itemIndex].quantity;

            setItems(updatedItems);

            addToast(setToasts, {
                message: `${updateItem.name} quantity updated to ${newItemValue}`,
                type: "Success",
            });
        } catch (error) {
            addToast(setToasts, {
                message: `There was a problem updating ${updateItem.name}.`,
                type: "Error",
            });
        }
    };

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();

        try {
            const newItem = {
                name: item.name,
                quantity: item.quantity,
                category: item.category,
                note: item.note ?? "",
                completed: false,
            };

            const result = await addItem(user.uid, newItem);

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
            const savedItem = await updateQuickAddItem(user.uid, itemId, updatedItem);

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

    return (
        <main
            className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
            role="main"
        >
            <div className="w-full max-w-xl flex flex-col items-center gap-4">
                <section className="rounded-md border border-base-300 bg-base-100 p-4 text-center w-full">
                    <h1 className="text-3xl font-bold">Quick Add Items</h1>
                    <p className="mt-2 text-sm text-base-content/75">
                        Save groceries you buy often, then add them to your shopping list with one tap.
                    </p>

                    <div className="mt-4">
                        <Link href="/shopping-list" className="btn btn-outline h-auto px-4 py-2">
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