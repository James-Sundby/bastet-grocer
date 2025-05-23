import { db } from "../_utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  deleteDoc,
  doc,
  updateDoc,
  where,
  writeBatch,
  getDoc
} from "firebase/firestore";

export const getShoppingList = async (userId) => {
  try {
    const itemsCollection = collection(db, "users", userId, "items");
    const querySnapshot = await getDocs(itemsCollection);

    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  } catch (error) {
    console.error("Error retrieving shopping list from database.", error);
    window.alert("Error retrieving shopping list from database.");
  }
};

export const deleteShoppingList = async (userId) => {
  try {
    const itemsCollection = collection(db, "users", userId, "items");
    const querySnapshot = await getDocs(itemsCollection);

    const batch = writeBatch(db);

    querySnapshot.forEach((docItem) => {
      const itemRef = doc(db, "users", userId, "items", docItem.id);
      batch.delete(itemRef);
    });

    await batch.commit();
    console.log("Shopping list deleted successfully.");
    return true;
  } catch (error) {
    console.error("Error deleting shopping list from database.", error);
    window.alert("Error deleting shopping list from database.");
    return false;
  }
};

export const addItem = async (userId, item) => {
  try {
    if (!item.name || !item.quantity) {
      throw new Error(
        "The item object is missing required fields (name or quantity)."
      );
    }

    const itemsCollection = collection(db, "users", userId, "items");
    const q = query(itemsCollection, where("name", "==", item.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let existingItem = querySnapshot.docs[0];
      let newQuantity = existingItem.data().quantity + item.quantity;
      await updateDoc(doc(db, "users", userId, "items", existingItem.id), { quantity: newQuantity });
      return existingItem.id;
    }
    else {
      const docRef = await addDoc(itemsCollection, item);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding item to database.", error);
    window.alert("Error adding item to database.");
  }
};

export const removeItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "items", itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (error) {
    console.error("Error removing item: ", error);
    window.alert("Error removing item.");
  }
};

export const updateItemStatus = async (userId, itemId, completed) => {
  try {
    const itemRef = doc(db, "users", userId, "items", itemId);
    await updateDoc(itemRef, { completed });
  } catch (error) {
    console.error("Error updating item status: ", error);
    window.alert("Error updating item status.");
  }
}

export const getQuickAddItems = async (userId) => {
  try {
    const itemsCollection = collection(db, "users", userId, "quick-add");
    const querySnapshot = await getDocs(itemsCollection);

    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  }
  catch (error) {
    console.error("Error retrieving quick add items from database.", error);
    window.alert("Error retrieving quick add items from database.");
  }
};

export const addQuickAddItem = async (userId, item) => {
  try {
    if (!item.name || !item.quantity) {
      throw new Error(
        "The item object is missing required fields (name or quantity)."
      );
    }

    const itemsCollection = collection(db, "users", userId, "quick-add");
    const q = query(itemsCollection, where("name", "==", item.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let existingItem = querySnapshot.docs[0];
      let newQuantity = existingItem.data().quantity + item.quantity;
      await updateDoc(doc(db, "users", userId, "quick-add", existingItem.id), { quantity: newQuantity });
      return existingItem.id;
    }
    else {
      const docRef = await addDoc(itemsCollection, item);
      return docRef.id;
    }
  }
  catch (error) {
    console.error("Error adding quick add item to database.", error);
    window.alert("Error adding quick add item to database.");
  }
};

export const removeQuickAddItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "quick-add", itemId);
    await deleteDoc(itemRef);
    return itemId;
  }
  catch (error) {
    console.error("Error removing quick add item: ", error);
    window.alert("Error removing quick add item.");
  }
};


export const incrementDecrementQuickAdd = async (userId, itemId, value) => {
  try {
    if (!itemId || value == null) {
      throw new Error("Item ID or value is missing.");
    }

    if (value !== 1 && value !== -1) {
      throw new Error("Value must be either 1  or -1.");
    }

    const itemRef = doc(db, "users", userId, "quick-add", itemId);
    const itemSnapshot = await getDoc(itemRef);
    if (!itemSnapshot.exists()) {
      throw new Error("Item does not exist.");
    }
    const item = itemSnapshot.data();
    const newQuantity = item.quantity + value;
    await updateDoc(itemRef, { quantity: newQuantity });

    console.log(`Successfully updated item quantity to ${newQuantity}.`);
  }
  catch (error) {
    console.error("Error incrementing/decrementing quick add item: ", error);
    window.alert("Error incrementing/decrementing quick add item.");
  }
}

export const incrementDecrementItem = async (userId, itemId, value) => {
  try {
    if (!itemId || value == null) {
      throw new Error("Item ID or value is missing.");
    }

    if (value !== 1 && value !== -1) {
      throw new Error("Value must be either 1  or -1.");
    }

    const itemRef = doc(db, "users", userId, "items", itemId);
    const itemSnapshot = await getDoc(itemRef);
    if (!itemSnapshot.exists()) {
      throw new Error("Item does not exist.");
    }
    const item = itemSnapshot.data();
    const newQuantity = item.quantity + value;
    await updateDoc(itemRef, { quantity: newQuantity });

    console.log(`Successfully updated item quantity to ${newQuantity}.`);
  }
  catch (error) {
    console.error("Error incrementing/decrementing item: ", error);
    window.alert("Error incrementing/decrementing  item.");
  }
}
