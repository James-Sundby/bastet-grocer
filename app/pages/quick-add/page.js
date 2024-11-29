"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../_utils/auth-context";
import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    addItem,
    incrementDecrementQuickAdd
} from "../../_services/shopping-list-service";
import Redirect from "../../components/organisms/redirect";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import Toast, { addToast } from "../../components/atoms/toast";

export default function Home() {
    const { user } = useUserAuth();
    const [items, setItems] = useState([]);
    const [toasts, setToasts] = useState([]);

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

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${item.name}`,
                message: `${item.name} added`,
                type: "Success",
                colour: "",
            });

        } catch (error) {
            console.error("Error adding item: ", error);

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${item.name}`,
                message: `There was a problem adding ${item.name} to your quick adds.`,
                type: "Error",
                colour: "alert-error",
            });
        }
    };

    const handleRemoveItem = async (removedItem, event) => {
        event.stopPropagation();
        try {
            await removeQuickAddItem(user.uid, removedItem.id);
            setItems((prevItems) => prevItems.filter((item) => item.id !== removedItem.id));

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${removedItem.name}`,
                message: `${removedItem.name} deleted`,
                type: "Success",
                colour: "",
            });

        } catch (error) {
            console.error("Error removing item: ", error);

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${removedItem.name}`,
                message: `There was a problem removing ${removedItem.name} from your quick adds.`,
                type: "Error",
                colour: "alert-error",
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

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${updateItem.name}`,
                message: `${updateItem.name} quantity updated to ${newItemValue}`,
                type: "Success",
                colour: "",
            });
        } catch (error) {
            console.error("Error updating item quantity: ", error);

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${updateItem.name}`,
                message: `There was a problem updating ${updateItem.name}.`,
                type: "Error",
                colour: "alert-error",
            });
        }
    };

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();
        try {
            const newItem = { ...item, completed: false };
            await addItem(user.uid, newItem);

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${item.name}`,
                message: `${item.name} added to shopping list`,
                type: "Success",
                colour: "",
            });
        } catch (error) {
            console.error("Error adding item to shopping list: ", error);

            addToast(toasts, setToasts, {
                id: `${Date.now()}-${item.name}`,
                message: `There was a problem adding ${item.name} to your shopping list.`,
                type: "Error",
                colour: "alert-error",
            });
        }
    };

    useEffect(() => {
        const loadItems = async () => {
            try {
                const items = await getQuickAddItems(user.uid);
                setItems(items);
            } catch (error) {
                console.error("Error retrieving shopping list: ", error);
            }
        };

        if (user) {
            loadItems();
        }
    }, [user]);

    return (
        <>
            {user ? (
                <main className="flex flex-col items-center w-screen">
                    <h1 className="text-4xl font-bold mx-4 mb-4 max-w-xl text-center">
                        Quick Add Items
                    </h1 >
                    <div className="w-screen md:max-w-xl pb-4">
                        <NewItemForm onAddItem={handleAddItem} isQuickAdd={true} />
                        <ItemList
                            items={items}
                            onDelete={handleRemoveItem}
                            onAdd={handleAddToShoppingList}
                            isQuickAdd={true}
                            onIncrement={handleIncrementDecrement}
                            onDecrement={handleIncrementDecrement}
                        />
                        <Toast toasts={toasts} />
                    </div>
                </main >
            ) : (
                <Redirect />
            )}
        </>
    );
}
