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
                console.error("Error retrieving quick add items: ", error);
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
            const newItemId = await addQuickAddItem(user.uid, item);
            const newItem = { ...item, id: newItemId };

            const existingIndex = items.findIndex((i) => i.id === newItemId);

            if (existingIndex !== -1) {
                const updatedItems = [...items];
                updatedItems[existingIndex].quantity += item.quantity;
                setItems(updatedItems);
            } else {
                setItems((prevItems) => [...prevItems, newItem]);
            }

            addToast(setToasts, {
                message: `${item.name} added`,
                type: "Success",
            });

        } catch (error) {
            console.error("Error adding item: ", error);

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
            console.error("Error removing item: ", error);

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
            const itemIndex = updatedItems.findIndex((item) => item.id === updateItem.id);
            updatedItems[itemIndex].quantity += value;
            const newItemValue = updatedItems[itemIndex].quantity;
            setItems(updatedItems);

            addToast(setToasts, {
                message: `${updateItem.name} quantity updated to ${newItemValue}`,
                type: "Success",
            });
        } catch (error) {
            console.error("Error updating item quantity: ", error);

            addToast(setToasts, {
                message: `There was a problem updating ${updateItem.name}.`,
                type: "Error",
            });
        }
    };

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();
        try {
            const newItem = { ...item, completed: false };
            await addItem(user.uid, newItem);

            addToast(setToasts, {
                message: `${item.name} added to shopping list`,
                type: "Success",
            });
        } catch (error) {
            console.error("Error adding item to shopping list: ", error);

            addToast(setToasts, {
                message: `There was a problem adding ${item.name} to your shopping list.`,
                type: "Error",
            });
        }
    };

    return (
        <main className="flex flex-1 flex-col items-center bg-base-200 p-4 md:p-8" role="main">
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
                />

                <Toast toasts={toasts} />
            </div>
        </main>
    );
}