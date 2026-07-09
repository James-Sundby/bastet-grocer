"use client";

import { Suspense, useState } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

import { useSupabaseClient } from "@/app/_utils/useSupabaseClient";
import { useActiveGroceryList } from "@/app/_hooks/useActiveGroceryList";
import { useShoppingListPage } from "@/app/_hooks/useShoppingListPage";

import GroceryPageShell from "@/app/components/templates/groceryPageShell";
import HouseholdRequired from "@/app/components/molecules/householdRequired";
import ShoppingListHeader from "@/app/components/organisms/shoppingListHeader";
import ShoppingListFooterActions from "@/app/components/organisms/shoppingListFooterActions";
import ListManager from "@/app/components/organisms/listManager";

import NewItemForm from "@/app/components/molecules/newItemForm";
import ItemList from "@/app/components/organisms/itemList";
import ConfirmModal from "@/app/components/molecules/confirmModal";
import Toast from "@/app/components/atoms/toast";
import PageLoadAlert from "@/app/components/molecules/pageLoadAlert";
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
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, orgId } = useAuth();

  const requestedListId = searchParams.get("list");

  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isShoppingMode, setIsShoppingMode] = useState(false);

  const {
    isReady: isListReady,
    hasError: hasListError,
    errorMessage: listErrorMessage,
    lists,
    activeList,
    activeListId,
    handleSelectList,
    handleCreateList,
    handleRenameList,
    handleDeleteList,
  } = useActiveGroceryList({
    supabase,
    isLoaded,
    isSignedIn,
    orgId,
    requestedListId,
    setToasts,
  });

  const shoppingList = useShoppingListPage({
    supabase,
    orgId,
    activeListId,
    setToasts,
    confirmModal,
    setConfirmModal,
    setIsConfirming,
  });


  const handleManagedListSelect = (listId) => {
    setIsShoppingMode(false);
    handleSelectList(listId);
  };


  const listManager = !isShoppingMode ? (
    <ListManager
      lists={lists}
      activeList={activeList}
      activeListId={activeListId}
      onSelectList={handleManagedListSelect}
      onCreateList={handleCreateList}
      onRenameList={handleRenameList}
      onDeleteList={handleDeleteList}
    />
  ) : null;

  if (!isLoaded) {
    return <GroceryPageSkeleton />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (!orgId) {
    return (
      <HouseholdRequired
        toasts={toasts}
        afterCreateOrganizationUrl="/shopping-list"
        afterSelectOrganizationUrl="/shopping-list"
      />
    );
  }

  if (hasListError || shoppingList.hasError) {
    return (
      <>
        <GroceryPageShell>
          <PageLoadAlert
            title="Couldn’t load your shopping list"
            message={
              listErrorMessage ??
              shoppingList.errorMessage ??
              "Refresh the page and try again."
            }
          />
        </GroceryPageShell>

        <Toast toasts={toasts} />
      </>
    );
  }


  if (!isListReady || !shoppingList.isReady) {
    return <GroceryPageSkeleton />;
  }


  return (
    <>
      <GroceryPageShell>
        <ShoppingListHeader
          activeList={activeList}
          activeListId={activeListId}
          isShoppingMode={isShoppingMode}
          remainingCount={shoppingList.remainingCount}
          completedCount={shoppingList.completedCount}
          onToggleShoppingMode={() =>
            setIsShoppingMode((current) => !current)
          }
          listManager={listManager}
        />

        {!isShoppingMode && (
          <NewItemForm onAddItem={shoppingList.handleAddItem} />
        )}

        <ItemList
          items={shoppingList.items}
          onDelete={shoppingList.handleRemoveItem}
          onStatusChange={shoppingList.handleItemStatusChange}
          onIncrement={
            isShoppingMode ? undefined : shoppingList.handleIncrementDecrement
          }
          onDecrement={
            isShoppingMode ? undefined : shoppingList.handleIncrementDecrement
          }
          onUpdate={isShoppingMode ? undefined : shoppingList.handleUpdateItem}
          isShoppingMode={isShoppingMode}
        />

        <ShoppingListFooterActions
          isShoppingMode={isShoppingMode}
          hasCompletedItems={shoppingList.hasCompletedItems}
          completedCount={shoppingList.completedCount}
          showActionGroup={shoppingList.showActionGroup}
          onExitShoppingMode={() => setIsShoppingMode(false)}
          onClearCompleted={shoppingList.requestClearCompleted}
          onDeleteAll={shoppingList.requestDeleteAll}
        />
      </GroceryPageShell>

      <ConfirmModal
        isOpen={Boolean(confirmModal)}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmLabel={confirmModal?.confirmLabel}
        cancelLabel="Cancel"
        onConfirm={shoppingList.handleConfirmAction}
        onClose={() => {
          if (!isConfirming) {
            setConfirmModal(null);
          }
        }}
        isLoading={isConfirming}
        variant="error"
      />

      <Toast toasts={toasts} />
    </>
  );
}