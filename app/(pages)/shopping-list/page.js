"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { useUserAuth } from "../../_utils/auth-context";
import {
  getShoppingList,
  addItem,
  removeItem,
  updateItemStatus,
  deleteShoppingList,
  incrementDecrementItem,
  clearCompletedItems,
  updateItem
} from "../../_services/shopping-list-service";

import DeleteAllButton from "../../components/atoms/deleteAllButton";
import ClearCompletedButton from "@/app/components/atoms/clearCompletedButton";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import ConfirmModal from "@/app/components/molecules/confirmModal";
import Toast, { addToast } from "../../components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function Home() {
  const { user, loading } = useUserAuth();

  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isShoppingMode, setIsShoppingMode] = useState(false);

  const completedCount = items.filter((item) => item.completed).length;
  const remainingCount = items.length - completedCount;
  const hasCompletedItems = completedCount > 0;
  const showActionGroup = items.length > 1;

  const handleAddItem = async (item) => {
    try {
      const result = await addItem(user.uid, item);

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
          message: `${item.name} quantity updated to ${result.quantity}`,
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
        message: `${item.name} added`,
        type: "Success",
      });
    } catch (error) {
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

      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== removedItem.id)
      );

      addToast(setToasts, {
        message: `${removedItem.name} deleted`,
        type: "Success",
      });
    } catch (error) {
      // console.error("Error removing item: ", error);

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
      // console.error("Error updating item status: ", error);

      addToast(setToasts, {
        message: "There was a problem updating that item.",
        type: "Error",
      });
    }
  };

  const requestDeleteAll = () => {
    if (!items.length) {
      addToast(setToasts, {
        message: "Your shopping list is already empty.",
        type: "Info",
      });
      return;
    }

    setConfirmModal({
      type: "delete-all",
      title: "Delete all items?",
      message: "This will remove every item from your shopping list.",
      confirmLabel: "Delete All",
    });
  };

  const confirmDeleteAll = async () => {
    try {
      setIsConfirming(true);

      const deleted = await deleteShoppingList(user.uid);

      if (!deleted) {
        addToast(setToasts, {
          message: "There was an error deleting your shopping list.",
          type: "Error",
        });
        return;
      }

      setItems([]);

      addToast(setToasts, {
        message: "Shopping list deleted",
        type: "Success",
      });

      setConfirmModal(null);
    } catch (error) {
      // console.error("Error deleting all items: ", error);

      addToast(setToasts, {
        message: "There was a problem deleting your shopping list.",
        type: "Error",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const requestClearCompleted = () => {
    if (!completedCount) {
      addToast(setToasts, {
        message: "There are no completed items to clear.",
        type: "Info",
      });
      return;
    }

    setConfirmModal({
      type: "clear-completed",
      title: "Clear checked items?",
      message: `This will remove the ${completedCount} checked item${completedCount === 1 ? "" : "s"
        } from your shopping list.`,
      confirmLabel: `Clear Item${completedCount === 1 ? "" : "s"}`,
    });
  };

  const confirmClearCompleted = async () => {
    try {
      setIsConfirming(true);

      const deletedCount = await clearCompletedItems(user.uid);

      setItems((prevItems) => prevItems.filter((item) => !item.completed));

      addToast(setToasts, {
        message: `${deletedCount} checked item${deletedCount === 1 ? "" : "s"
          } cleared`,
        type: "Success",
      });

      setConfirmModal(null);
    } catch (error) {
      // console.error("Error clearing checked items: ", error);

      addToast(setToasts, {
        message: "There was a problem clearing checked items.",
        type: "Error",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) {
      return;
    }

    if (confirmModal.type === "delete-all") {
      await confirmDeleteAll();
      return;
    }

    if (confirmModal.type === "clear-completed") {
      await confirmClearCompleted();
    }
  };

  const handleIncrementDecrement = async (updateItem, event, value) => {
    event.stopPropagation();

    try {
      await incrementDecrementItem(user.uid, updateItem.id, value);

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
      // console.error("Error updating item quantity: ", error);

      addToast(setToasts, {
        message: `There was a problem updating ${updateItem.name}.`,
        type: "Error",
      });
    }
  };

  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      const savedItem = await updateItem(user.uid, itemId, updatedItem);

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
            : "There was a problem updating that item.",
        type: "Error",
      });

      return false;
    }
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await getShoppingList(user.uid);
        setItems(items);
      } catch (error) {
        // console.error("Error retrieving shopping list: ", error);
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

  return (
    <>
      <main
        className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
        role="main"
      >
        <div className="flex w-full max-w-xl flex-1 flex-col items-center gap-4">
          <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">
            <h1 className="text-3xl font-bold">
              {isShoppingMode ? "Shopping Mode" : "Shopping List"}
            </h1>

            <p className="mt-2 text-sm text-base-content/75">
              {isShoppingMode
                ? `${remainingCount} left · ${completedCount} checked`
                : "Add groceries, check them off as you shop, and keep your list synced across devices."}
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                className={isShoppingMode ? "btn btn-accent" : "btn btn-primary"}
                onClick={() => setIsShoppingMode((current) => !current)}
              >
                {isShoppingMode ? "Exit Shopping Mode" : "Start Shopping Mode"}
              </button>

              {!isShoppingMode && (
                <Link href="/quick-add" className="btn btn-outline h-auto px-4 py-2">
                  Manage Quick Adds
                </Link>
              )}
            </div>
          </section>

          {!isShoppingMode && <NewItemForm onAddItem={handleAddItem} />}

          <ItemList
            items={items}
            onDelete={handleRemoveItem}
            onStatusChange={handleItemStatusChange}
            onIncrement={handleIncrementDecrement}
            onDecrement={handleIncrementDecrement}
            onUpdate={handleUpdateItem}
            isShoppingMode={isShoppingMode}
          />

          <Toast toasts={toasts} />
        </div>

        {isShoppingMode ? (
          <div className="mt-auto w-full max-w-xl pt-8">
            {hasCompletedItems ? (
              <div className="grid grid-cols-2 gap-3">
                <ClearCompletedButton
                  onClearCompleted={requestClearCompleted}
                  count={completedCount}
                />
                <button
                  type="button"
                  className="btn btn-accent w-full h-auto px-4 py-2"
                  onClick={() => setIsShoppingMode(false)}
                >
                  Exit Mode
                </button>
              </div>

            ) : (
              <button
                type="button"
                className="btn btn-accent w-full h-auto px-4 py-2"
                onClick={() => setIsShoppingMode(false)}
              >
                Exit Mode
              </button>
            )}
          </div>
        ) : (
          showActionGroup && (
            <div className="mt-auto w-full max-w-xl pt-8">
              {hasCompletedItems ? (
                <div className="grid grid-cols-2 gap-3">
                  <ClearCompletedButton
                    onClearCompleted={requestClearCompleted}
                    count={completedCount}
                  />
                  <DeleteAllButton onDeleteAll={requestDeleteAll} />
                </div>
              ) : (
                <DeleteAllButton onDeleteAll={requestDeleteAll} />
              )}
            </div>
          )
        )}
      </main>

      <ConfirmModal
        isOpen={Boolean(confirmModal)}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmLabel={confirmModal?.confirmLabel}
        onConfirm={handleConfirmAction}
        onClose={() => setConfirmModal(null)}
        isLoading={isConfirming}
        variant="error"
      />
    </>
  );
}