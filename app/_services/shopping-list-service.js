import { db } from "../_utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  deleteDoc,
  doc,
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
    const docRef = await addDoc(itemsCollection, item);
    return docRef.id;
  } catch (error) {
    console.error("Error adding item to database.", error);
  }
};

export const removeItem = async (userId, itemId) => {
  try {
    const itemRef = doc(db, "users", userId, "items", itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (error) {
    console.error("Error removing item: ", error);
  }
};
