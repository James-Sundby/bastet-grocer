"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  CreateOrganization,
  OrganizationSwitcher,
  RedirectToSignIn,
  useAuth,
} from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

import { useSupabaseClient } from "@/app/_utils/useSupabaseClient";

import {
  getShoppingList,
  addItem,
  removeItem,
  updateItemStatus,
  deleteShoppingList,
  incrementDecrementItem,
  clearCompletedItems,
  updateItem,
} from "../../_services/item-service";

import {
  getLists,
  createList,
} from "../../_services/list-service";

import DeleteAllButton from "../../components/atoms/deleteAllButton";
import ClearCompletedButton from "@/app/components/atoms/clearCompletedButton";
import ItemList from "../../components/organisms/itemList";
import NewItemForm from "../../components/molecules/newItemForm";
import ConfirmModal from "@/app/components/molecules/confirmModal";
import Toast, { addToast } from "../../components/atoms/toast";
import { GroceryPageSkeleton } from "@/app/components/atoms/skeletons";

export default function ShoppingListPage() {
  return (
    <Suspense fallback={<GroceryPageSkeleton />}>
      <ShoppingListPageContent />
    </Suspense>
  );
}

function ShoppingListPageContent() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, orgId } = useAuth();

  const requestedListId = searchParams.get("list");

  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [items, setItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isShoppingMode, setIsShoppingMode] = useState(false);
  const [isListsLoading, setIsListsLoading] = useState(false);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [hasLoadedLists, setHasLoadedLists] = useState(false);

  const activeList = lists.find((list) => list.id === activeListId);

  const completedCount = items.filter((item) => item.completed).length;
  const remainingCount = items.length - completedCount;
  const hasCompletedItems = completedCount > 0;
  const showActionGroup = items.length > 1;

  useEffect(() => {
    if (isLoaded && (!isSignedIn || !orgId)) {
      setLists([]);
      setActiveListId(null);
      setItems([]);
      setHasLoadedLists(false);
      setIsShoppingMode(false);
    }
  }, [isLoaded, isSignedIn, orgId]);

  useEffect(() => {
    const loadLists = async () => {
      try {
        setIsListsLoading(true);
        setHasLoadedLists(false);

        const loadedLists = await getLists(supabase);

        if (loadedLists.length === 0) {
          const newList = await createList(supabase, orgId, "Shopping List");

          setLists([newList]);
          setActiveListId(newList.id);
          return;
        }

        const requestedList = loadedLists.find(
          (list) => list.id === requestedListId
        );

        setLists(loadedLists);
        setActiveListId(requestedList?.id ?? loadedLists[0].id);
      } catch (error) {
        addToast(setToasts, {
          message: "There was a problem loading your lists.",
          type: "Error",
        });
      } finally {
        setIsListsLoading(false);
        setHasLoadedLists(true);
      }
    };

    if (isLoaded && isSignedIn && orgId) {
      loadLists();
    }
  }, [supabase, isLoaded, isSignedIn, orgId, requestedListId]);

  useEffect(() => {
    const loadItems = async () => {
      if (!activeListId) {
        setItems([]);
        return;
      }

      try {
        setIsItemsLoading(true);

        const loadedItems = await getShoppingList(supabase, activeListId);
        setItems(loadedItems);
      } catch (error) {
        addToast(setToasts, {
          message: "There was a problem loading your shopping list.",
          type: "Error",
        });
      } finally {
        setIsItemsLoading(false);
      }
    };

    if (isLoaded && isSignedIn && orgId && activeListId) {
      loadItems();
    }
  }, [supabase, isLoaded, isSignedIn, orgId, activeListId]);

  const handleAddItem = async (item) => {
    if (!activeListId) {
      addToast(setToasts, {
        message: "Create or select a list before adding items.",
        type: "Error",
      });
      return;
    }

    try {
      const result = await addItem(supabase, orgId, activeListId, item);

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
      await removeItem(supabase, removedItem.id);

      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== removedItem.id)
      );

      addToast(setToasts, {
        message: `${removedItem.name} deleted`,
        type: "Success",
      });
    } catch (error) {
      addToast(setToasts, {
        message: `There was a problem removing ${removedItem.name} from your shopping list.`,
        type: "Error",
      });
    }
  };

  const handleItemStatusChange = async (itemId, completed) => {
    try {
      await updateItemStatus(supabase, itemId, completed);

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, completed } : item
        )
      );
    } catch (error) {
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
    if (!activeListId) {
      return;
    }

    try {
      setIsConfirming(true);

      const deleted = await deleteShoppingList(supabase, activeListId);

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
    if (!activeListId) {
      return;
    }

    try {
      setIsConfirming(true);

      const deletedCount = await clearCompletedItems(supabase, activeListId);

      setItems((prevItems) => prevItems.filter((item) => !item.completed));

      addToast(setToasts, {
        message: `${deletedCount} checked item${deletedCount === 1 ? "" : "s"
          } cleared`,
        type: "Success",
      });

      setConfirmModal(null);
    } catch (error) {
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

  const handleIncrementDecrement = async (updatedItem, event, value) => {
    event.stopPropagation();

    try {
      const result = await incrementDecrementItem(
        supabase,
        updatedItem.id,
        value
      );

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id
            ? { ...item, quantity: result.quantity }
            : item
        )
      );

      addToast(setToasts, {
        message: `${updatedItem.name} quantity updated to ${result.quantity}`,
        type: "Success",
      });
    } catch (error) {
      addToast(setToasts, {
        message: `There was a problem updating ${updatedItem.name}.`,
        type: "Error",
      });
    }
  };

  const handleUpdateItem = async (itemId, updatedItem) => {
    try {
      const savedItem = await updateItem(supabase, itemId, updatedItem);

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

  const handleListChange = (event) => {
    const nextListId = event.target.value;

    setItems([]);
    setIsShoppingMode(false);
    setActiveListId(nextListId);
    router.replace(`/shopping-list?list=${nextListId}`);
  };

  const closeConfirmModal = () => {
    if (!isConfirming) {
      setConfirmModal(null);
    }
  };

  if (!isLoaded) {
    return <GroceryPageSkeleton />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (!orgId) {
    return (
      <main
        className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
        role="main"
      >
        <section className="w-full max-w-xl rounded-md border border-base-300 bg-base-100 p-6 text-center">
          <h1 className="text-3xl font-bold">Create a Household</h1>

          <p className="mt-2 text-sm text-base-content/75">
            Create or select a household before using shared grocery lists.
          </p>

          <div className="mt-6 flex justify-center">
            <CreateOrganization
              afterCreateOrganizationUrl="/shopping-list"
              skipInvitationScreen={false}
            />
          </div>

          <div className="mt-6 border-t border-base-300 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-base-content/60">
              Already have one?
            </p>

            <div className="flex justify-center">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/shopping-list"
                afterSelectOrganizationUrl="/shopping-list"
              />
            </div>
          </div>
        </section>

        <Toast toasts={toasts} />
      </main>
    );
  }

  if (!hasLoadedLists || isListsLoading || isItemsLoading) {
    return <GroceryPageSkeleton />;
  }

  return (
    <>
      <main
        className="flex flex-1 flex-col items-center bg-base-200 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-8 md:pt-8 md:pb-[calc(env(safe-area-inset-bottom)+2rem)]"
        role="main"
      >
        <div className="flex w-full max-w-xl flex-1 flex-col items-center gap-4">
          <section className="w-full rounded-md border border-base-300 bg-base-100 p-4 text-center">

            <h1 className="mt-2 text-3xl font-bold">
              {isShoppingMode ? "Shopping Mode" : "Shopping List"}
            </h1>

            <p className="mt-2 text-sm text-base-content/75">
              {isShoppingMode
                ? `${remainingCount} left · ${completedCount} checked`
                : "Add groceries, check them off as you shop, and keep your list synced across devices."}
            </p>

            {lists.length > 1 && !isShoppingMode && (
              <label className="form-control mx-auto mt-4 w-full max-w-xs">
                <span className="label-text mb-1 text-left font-bold">
                  Active List
                </span>

                <select
                  className="select select-bordered w-full"
                  value={activeListId ?? ""}
                  onChange={handleListChange}
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                className={isShoppingMode ? "btn btn-outline" : "btn btn-primary"}
                onClick={() => setIsShoppingMode((current) => !current)}
              >
                {isShoppingMode ? "Exit Shopping Mode" : "Start Shopping Mode"}
              </button>

              {!isShoppingMode && (
                <Link
                  href={
                    activeListId
                      ? `/quick-add?list=${activeListId}`
                      : "/quick-add"
                  }
                  className="btn btn-outline h-auto px-4 py-2"
                >
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
            onIncrement={isShoppingMode ? undefined : handleIncrementDecrement}
            onDecrement={isShoppingMode ? undefined : handleIncrementDecrement}
            onUpdate={isShoppingMode ? undefined : handleUpdateItem}
            isShoppingMode={isShoppingMode}
          />

          {isShoppingMode ? (
            <div className="mt-auto grid w-full max-w-xl grid-cols-2 gap-3 pt-8">
              <button
                type="button"
                className="btn btn-outline h-auto px-4 py-2"
                onClick={() => setIsShoppingMode(false)}
              >
                Exit Mode
              </button>

              {hasCompletedItems ? (
                <ClearCompletedButton
                  onClearCompleted={requestClearCompleted}
                  count={completedCount}
                />
              ) : (
                <button
                  type="button"
                  className="btn btn-disabled h-auto px-4 py-2"
                >
                  Clear Checked
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
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(confirmModal)}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmLabel={confirmModal?.confirmLabel}
        cancelLabel="Cancel"
        onConfirm={handleConfirmAction}
        onClose={closeConfirmModal}
        isLoading={isConfirming}
        variant="error"
      />

      <Toast toasts={toasts} />
    </>
  );
}