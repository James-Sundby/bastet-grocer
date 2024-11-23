"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import {
    getQuickAddItems,
    addQuickAddItem,
    removeQuickAddItem,
    addItem,
} from "../_services/shopping-list-service";
import Redirect from "../_services/redirect";
import ItemList from "../components/itemList";
import NewItemForm from "../components/newItemForm";

export default function Home() {
    const { user } = useUserAuth();
    const [items, setItems] = useState([]);
    const [toasts, setToasts] = useState([]);

    const handleAddItem = async (item) => {
        try {
            const newItemId = await addQuickAddItem(user.uid, item);
            const newItem = { ...item, id: newItemId };
            setItems((prevItems) => [...prevItems, newItem]);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    const handleRemoveItem = async (itemId, event) => {
        event.stopPropagation();
        try {
            await removeQuickAddItem(user.uid, itemId);
            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    const handleAddToShoppingList = async (item, event) => {
        event.stopPropagation();
        try {
            const newItem = { ...item, completed: false };
            await addItem(user.uid, newItem);
            const newToast = { id: Date.now(), message: `${item.name} added to shopping list` };
            setToasts((prevToasts) => [...prevToasts, newToast]);
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
            }, 1000);
        } catch (error) {
            console.error("Error adding item to shopping list: ", error);
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
                        />
                        <div className="toast">
                            {toasts.map((toast) => (
                                <div key={toast.id} role="alert" className="alert alert-info">
                                    <span>{toast.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main >
            ) : (
                <Redirect />
            )}
        </>
    );
}
