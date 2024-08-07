"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../_utils/auth-context";
import {
  getShoppingList,
  addItem,
  removeItem,
  updateItemStatus,
} from "../_services/shopping-list-service";
import ItemList from "../components/item-list";
import NewItem from "../components/new-item";
import Redirect from "../_services/redirect";

export default function Home() {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);

  const handleAddItem = async (item) => {
    try {
      const newItemId = await addItem(user.uid, item);
      const newItem = { ...item, id: newItemId };
      setItems((prevItems) => [...prevItems, newItem]);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const handleRemoveItem = async (itemId, event) => {
    event.stopPropagation();
    try {
      await removeItem(user.uid, itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const handleItemStatusChange = async (itemId, completed) => {
    try {
      await updateItemStatus(user.uid, itemId, completed);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, completed } : item
        )
      );
    } catch (error) {
      console.error("Error updating item status: ", error);
    }
  };

  const loadItems = async () => {
    try {
      const items = await getShoppingList(user.uid);
      setItems(items);
    } catch (error) {
      console.error("Error retrieving shopping list: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  return (
    <>
      {user ? (
        <main className="flex flex-col items-center w-screen">
          <h1 className="text-4xl font-bold mx-4 mb-4 max-w-xl text-center">
            Shopping List
          </h1 >
          <div className="w-screen md:max-w-xl">
            <NewItem onAddItem={handleAddItem} />
            <ItemList
              items={items}
              onDelete={handleRemoveItem}
              onStatusChange={handleItemStatusChange}
            />
          </div>
        </main >
      ) : (
        <Redirect />
      )
      }
    </>
  );
}