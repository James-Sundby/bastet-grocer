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
import Link from "next/link";

import NavBar from "../components/header";

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
        <main className="flex flex-col items-center w-screen ">
          <h1 className="text-4xl font-bold mx-4 mb-4 max-w-xl text-center">
            Shopping List
          </h1 >
          <div className="max-w-lg">
            <NewItem onAddItem={handleAddItem} />
            <ItemList
              items={items}
              onDelete={handleRemoveItem}
              onStatusChange={handleItemStatusChange}
            />
          </div>
        </main >
      ) : (
        <div className="card bg-base-200 shadow-xl max-w-lg mx-2 mb-2">
          <div className="card-body">
            <div>
              <h2 className="card-title text-2xl">Sorry</h2>
              <p>You must be logged in to access this page</p>
            </div>
            <div className="card-actions justify-center">
              <Link className="btn btn-primary btn-wide" href="/week10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 576 512"
                  className="inline-block w-5 h-5 stroke-current fill-primary-content"
                >
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z" />
                </svg>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}