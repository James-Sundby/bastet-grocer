import { db } from "../_utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const SHOPPING_LIST_COLLECTION = "items";
const QUICK_ADD_COLLECTION = "quick-add";

function getUserCollection(userId, collectionName) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  return collection(db, "users", userId, collectionName);
}

function getUserDoc(userId, collectionName, itemId) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!itemId) {
    throw new Error("Item ID is required.");
  }

  return doc(db, "users", userId, collectionName, itemId);
}

function normalizeItem(item) {
  const name = item.name?.trim();

  if (!name) {
    throw new Error("Item name is required.");
  }

  const quantity = Number(item.quantity);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error("Quantity must be a whole number between 1 and 99.");
  }

  return {
    ...item,
    name,
    quantity,
  };
}

async function getItems(userId, collectionName) {
  const itemsCollection = getUserCollection(userId, collectionName);
  const querySnapshot = await getDocs(itemsCollection);

  return querySnapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    ...docSnapshot.data(),
  }));
}

async function addOrIncrementItem(userId, collectionName, item) {
  const normalizedItem = normalizeItem(item);
  const itemsCollection = getUserCollection(userId, collectionName);

  const matchingItemsQuery = query(
    itemsCollection,
    where("name", "==", normalizedItem.name)
  );

  const querySnapshot = await getDocs(matchingItemsQuery);

  if (!querySnapshot.empty) {
    const existingItem = querySnapshot.docs[0];
    const existingData = existingItem.data();
    const itemRef = getUserDoc(userId, collectionName, existingItem.id);

    const currentQuantity = Number(existingData.quantity) || 0;
    const newQuantity = currentQuantity + normalizedItem.quantity;

    await updateDoc(itemRef, {
      quantity: increment(normalizedItem.quantity),
    });

    return {
      id: existingItem.id,
      action: "updated",
      quantity: newQuantity,
    };
  }

  const docRef = await addDoc(itemsCollection, normalizedItem);

  return {
    id: docRef.id,
    action: "created",
    quantity: normalizedItem.quantity,
  };
}

async function removeUserItem(userId, collectionName, itemId) {
  const itemRef = getUserDoc(userId, collectionName, itemId);
  await deleteDoc(itemRef);
  return itemId;
}

async function updateUserItem(userId, collectionName, itemId, item) {
  const normalizedItem = normalizeItem(item);
  const itemsCollection = getUserCollection(userId, collectionName);

  const matchingItemsQuery = query(
    itemsCollection,
    where("name", "==", normalizedItem.name)
  );

  const querySnapshot = await getDocs(matchingItemsQuery);

  const duplicateItem = querySnapshot.docs.find(
    (docSnapshot) => docSnapshot.id !== itemId
  );

  if (duplicateItem) {
    throw new Error("An item with this name already exists.");
  }

  const itemRef = getUserDoc(userId, collectionName, itemId);

  const updatedItem = {
    name: normalizedItem.name,
    quantity: normalizedItem.quantity,
    category: normalizedItem.category,
  };

  await updateDoc(itemRef, updatedItem);

  return {
    id: itemId,
    ...updatedItem,
  };
}

async function incrementDecrementUserItem(userId, collectionName, itemId, value) {
  if (value !== 1 && value !== -1) {
    throw new Error("Value must be either 1 or -1.");
  }

  const itemRef = getUserDoc(userId, collectionName, itemId);

  await updateDoc(itemRef, {
    quantity: increment(value),
  });

  return itemId;
}

export async function getShoppingList(userId) {
  return getItems(userId, SHOPPING_LIST_COLLECTION);
}

export async function addItem(userId, item) {
  return addOrIncrementItem(userId, SHOPPING_LIST_COLLECTION, item);
}

export async function removeItem(userId, itemId) {
  return removeUserItem(userId, SHOPPING_LIST_COLLECTION, itemId);
}

export async function updateItemStatus(userId, itemId, completed) {
  const itemRef = getUserDoc(userId, SHOPPING_LIST_COLLECTION, itemId);
  await updateDoc(itemRef, { completed });
  return itemId;
}

export async function deleteShoppingList(userId) {
  const itemsCollection = getUserCollection(userId, SHOPPING_LIST_COLLECTION);
  const querySnapshot = await getDocs(itemsCollection);

  const batch = writeBatch(db);

  querySnapshot.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  await batch.commit();
  return true;
}

export async function clearCompletedItems(userId) {
  try {
    const itemsCollection = getUserCollection(userId, SHOPPING_LIST_COLLECTION);
    const completedItemsQuery = query(
      itemsCollection,
      where("completed", "==", true)
    );

    const querySnapshot = await getDocs(completedItemsQuery);

    if (querySnapshot.empty) {
      return 0;
    }

    const batch = writeBatch(db);

    querySnapshot.forEach((docItem) => {
      batch.delete(docItem.ref);
    });

    await batch.commit();

    return querySnapshot.size;
  } catch (error) {
    console.error("Error clearing completed items from database.", error);
    throw error;
  }
};

export async function incrementDecrementItem(userId, itemId, value) {
  return incrementDecrementUserItem(
    userId,
    SHOPPING_LIST_COLLECTION,
    itemId,
    value
  );
}

export async function updateItem(userId, itemId, item) {
  return updateUserItem(userId, SHOPPING_LIST_COLLECTION, itemId, item);
}

export async function getQuickAddItems(userId) {
  return getItems(userId, QUICK_ADD_COLLECTION);
}

export async function addQuickAddItem(userId, item) {
  return addOrIncrementItem(userId, QUICK_ADD_COLLECTION, item);
}

export async function removeQuickAddItem(userId, itemId) {
  return removeUserItem(userId, QUICK_ADD_COLLECTION, itemId);
}

export async function incrementDecrementQuickAdd(userId, itemId, value) {
  return incrementDecrementUserItem(
    userId,
    QUICK_ADD_COLLECTION,
    itemId,
    value
  );
}

export async function updateQuickAddItem(userId, itemId, item) {
  return updateUserItem(userId, QUICK_ADD_COLLECTION, itemId, item);
}