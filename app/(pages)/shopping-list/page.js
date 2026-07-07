"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useUserAuth } from "../../_utils/auth-context";
import {
  getShoppingList,
  addItem,
  removeItem,
  updateItemStatus,
  deleteShoppingList,
  incrementDecrementItem,
} from "../../_services/shopping-list-service";
import DeleteAllButton from "../../components/atoms/deleteAllButton";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import Toast, { addToast } from "../../components/atoms/toast";
import Link from "next/link";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";


export default function Home() {
  const { user, loading } = useUserAuth();
  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);

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

      addToast(setToasts, {
        message: `${item.name} added`,
        type: "Success",
      });

    } catch (error) {
      console.error("Error adding item: ", error);

      addToast(setToasts, {
        message: `There was a problem adding ${item.name} to your shopping list.`,
        type: "Error",
      });

    }
  };

  const handleRemoveItem = async (removedItem, event) => {
    event.stopPropagation();
    try {
      await removeItem(user.uid, removedItem.id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== removedItem.id));

      addToast(setToasts, {
        message: `${removedItem.name} deleted`,
        type: "Success",
      });

    } catch (error) {
      console.error("Error removing item: ", error);

      addToast(setToasts, {
        message: `There was a problem removing ${removedItem.name} from your shopping list.`,
        type: "Error",
      });

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
    if (!items.length) {
      addToast(setToasts, {
        message: "Your shopping list is already empty.",
        type: "Info",
      });
      return;
    }

    const userConfirmed = window.confirm("Are you sure you want to delete all items?");
    if (!userConfirmed) {
      return;
    }

    try {
      const deleted = await deleteShoppingList(user.uid);

      if (!deleted) {
        console.error("Error deleting all items from shopping list.");
        addToast(setToasts, {
          message: "There was an error deleting your shopping list.",
          type: "Error",
        });
        return;
      }

      setItems([]);
      addToast(setToasts, {
        message: `Shopping list deleted`,
        type: "Success",
      });
    }
    catch (error) {
      console.error("Error deleting all items: ", error);
      addToast(setToasts, {
        message: `There was a problem deleting your shopping list.`,
        type: "Error",
      });
    }
  };

  const handleIncrementDecrement = async (updateItem, event, value) => {
    event.stopPropagation();
    try {
      await incrementDecrementItem(user.uid, updateItem.id, value);
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

  if (loading) {
    return <GroceryPageSkeleton />;
  }


  if (!user) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-base-200 p-4 md:p-8" role="main">
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
          <h1 className="text-3xl font-bold">Shopping List</h1>

          <p className="mt-2 text-sm text-base-content/75">
            Add groceries, check them off as you shop, and keep your list synced
            across devices.
          </p>

          <div className="mt-4">
            <Link
              href="/quick-add"
              className="btn btn-outline h-auto px-4 py-2"
            >
              Manage Quick Adds
            </Link>
          </div>
        </section>

        <NewItemForm onAddItem={handleAddItem} />

        <ItemList
          items={items}
          onDelete={handleRemoveItem}
          onStatusChange={handleItemStatusChange}
          onIncrement={handleIncrementDecrement}
          onDecrement={handleIncrementDecrement}
        />

        {items.length > 1 && (
          <DeleteAllButton onDeleteAll={handleDeleteAll} />
        )}

        <Toast toasts={toasts} />
      </div>
    </main>
  );
}