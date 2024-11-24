"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../../_utils/auth-context";
import {
  getShoppingList,
  addItem,
  removeItem,
  updateItemStatus,
  deleteShoppingList,
  incrementDecrementItem
} from "../../_services/shopping-list-service";
import Redirect from "../../components/organisms/redirect";
import DeleteAllButton from "../../components/atoms/deleteAllButton";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";

export default function Home() {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);

  const handleAddItem = async (item) => {
    try {
      const newItemId = await addItem(user.uid, item);
      const newItem = { ...item, id: newItemId };

      const existingIndex = items.findIndex((i) => i.id === newItemId);

      if (existingIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += item.quantity;
        setItems(updatedItems);
      } else {
        setItems((prevItems) => [...prevItems, newItem]);
      }

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

  const handleDeleteAll = async () => {
    if (!items.length || !window.confirm("Are you sure you want to delete all items?")) {
      return;
    }
    try {
      const deleted = await deleteShoppingList(user.uid);
      if (!deleted) {
        console.error("Error deleting all items: ", deleted);
        return;
      }
      setItems([]);
    }
    catch (error) {
      console.error("Error deleting all items: ", error);
    }
  };

  const handleIncrementDecrement = async (itemId, event, value) => {
    event.stopPropagation();
    try {
      await incrementDecrementItem(user.uid, itemId, value);
      const updatedItems = [...items];
      const itemIndex = updatedItems.findIndex((item) => item.id === itemId);
      updatedItems[itemIndex].quantity += value;
      setItems(updatedItems);
    } catch (error) {
      console.error("Error updating item quantity: ", error);
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await getShoppingList(user.uid);
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
            Shopping List
          </h1 >
          <div className="w-screen md:max-w-xl pb-4">
            <NewItemForm onAddItem={handleAddItem} />
            <ItemList
              items={items}
              onDelete={handleRemoveItem}
              onStatusChange={handleItemStatusChange}
              onIncrement={handleIncrementDecrement}
              onDecrement={handleIncrementDecrement}
            />
            {items.length > 1 &&
              <DeleteAllButton onDeleteAll={handleDeleteAll} />
            }
          </div>
        </main >
      ) : (
        <Redirect />
      )
      }
    </>
  );
}