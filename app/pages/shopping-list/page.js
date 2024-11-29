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
import Toast, { addToast } from "../../components/atoms/toast";

export default function Home() {
  const { user } = useUserAuth();
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
        message: `There was a problem adding ${item.name} to your shopping list.`,
        type: "Error",
        colour: "alert-error",
      });

    }
  };

  const handleRemoveItem = async (removedItem, event) => {
    event.stopPropagation();
    try {
      await removeItem(user.uid, removedItem.id);
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
        message: `There was a problem removing ${removedItem.name} from your shopping list.`,
        type: "Error",
        colour: "alert-error",
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
      addToast(toasts, setToasts, {
        id: `${Date.now()}`,
        message: "Your shopping list is already empty.",
        type: "Info",
        colour: "alert-info",
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
        addToast(toasts, setToasts, {
          id: `${Date.now()}`,
          message: "There was an error deleting your shopping list.",
          type: "Error",
          colour: "alert-error",
        });
        return;
      }

      setItems([]);
      addToast(toasts, setToasts, {
        id: `${Date.now()}`,
        message: `Shopping list deleted`,
        type: "Success",
        colour: "",
      });
    }
    catch (error) {
      console.error("Error deleting all items: ", error);
      addToast(toasts, setToasts, {
        id: `${Date.now()}`,
        message: `There was a problem deleting your shopping list.`,
        type: "Error",
        colour: "alert-error",
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

            <Toast toasts={toasts} />
          </div>
        </main >
      ) : (
        <Redirect />
      )
      }
    </>
  );
}