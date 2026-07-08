function normalizeNameKey(name) {
    return name.trim().toLowerCase();
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

    const category = item.category?.trim();

    if (!category) {
        throw new Error("Category is required.");
    }

    return {
        name,
        name_key: normalizeNameKey(name),
        quantity,
        category,
        note: item.note?.trim() ?? "",
        completed: Boolean(item.completed),
    };
}

function mapItemRow(row) {
    return {
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        category: row.category,
        note: row.note ?? "",
        completed: row.completed,
    };
}

function throwFriendlyDuplicateError(error) {
    if (error?.code === "23505") {
        throw new Error("An item with this name already exists.");
    }

    throw error;
}

export async function getShoppingList(supabase, listId) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { data, error } = await supabase
        .from("items")
        .select("id, name, quantity, category, note, completed")
        .eq("list_id", listId)
        .order("category", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    return data.map(mapItemRow);
}

export async function addItem(supabase, orgId, listId, item) {
    if (!orgId) {
        throw new Error("Organization ID is required.");
    }

    if (!listId) {
        throw new Error("List ID is required.");
    }

    const normalizedItem = normalizeItem(item);

    const { data: existingItem, error: findError } = await supabase
        .from("items")
        .select("id, quantity, note")
        .eq("list_id", listId)
        .eq("name_key", normalizedItem.name_key)
        .maybeSingle();

    if (findError) {
        throw findError;
    }

    if (existingItem) {
        const newQuantity = existingItem.quantity + normalizedItem.quantity;

        if (newQuantity > 99) {
            throw new Error("Quantity must stay between 1 and 99.");
        }

        const nextNote = normalizedItem.note || existingItem.note || "";

        const { data, error } = await supabase
            .from("items")
            .update({
                quantity: newQuantity,
                note: nextNote,
                updated_at: new Date().toISOString(),
            })
            .eq("id", existingItem.id)
            .select("id, quantity, note")
            .single();

        if (error) {
            throw error;
        }

        return {
            id: data.id,
            action: "updated",
            quantity: data.quantity,
            note: data.note ?? "",
        };
    }

    const { data, error } = await supabase
        .from("items")
        .insert({
            org_id: orgId,
            list_id: listId,
            ...normalizedItem,
        })
        .select("id, quantity, note")
        .single();

    if (error) {
        throwFriendlyDuplicateError(error);
    }

    return {
        id: data.id,
        action: "created",
        quantity: data.quantity,
        note: data.note ?? "",
    };
}

export async function removeItem(supabase, itemId) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);

    if (error) {
        throw error;
    }

    return itemId;
}

export async function updateItemStatus(supabase, itemId, completed) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { error } = await supabase
        .from("items")
        .update({
            completed,
            updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

    if (error) {
        throw error;
    }

    return itemId;
}

export async function deleteShoppingList(supabase, listId) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { error } = await supabase
        .from("items")
        .delete()
        .eq("list_id", listId);

    if (error) {
        throw error;
    }

    return true;
}

export async function clearCompletedItems(supabase, listId) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { data, error } = await supabase
        .from("items")
        .delete()
        .eq("list_id", listId)
        .eq("completed", true)
        .select("id");

    if (error) {
        throw error;
    }

    return data?.length ?? 0;
}

export async function incrementDecrementItem(supabase, itemId, value) {
    if (value !== 1 && value !== -1) {
        throw new Error("Value must be either 1 or -1.");
    }

    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { data: currentItem, error: findError } = await supabase
        .from("items")
        .select("quantity")
        .eq("id", itemId)
        .single();

    if (findError) {
        throw findError;
    }

    const newQuantity = currentItem.quantity + value;

    if (newQuantity < 1 || newQuantity > 99) {
        throw new Error("Quantity must stay between 1 and 99.");
    }

    const { error } = await supabase
        .from("items")
        .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

    if (error) {
        throw error;
    }

    return {
        id: itemId,
        quantity: newQuantity,
    };
}

export async function updateItem(supabase, itemId, item) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const normalizedItem = normalizeItem(item);

    const { data, error } = await supabase
        .from("items")
        .update({
            name: normalizedItem.name,
            name_key: normalizedItem.name_key,
            quantity: normalizedItem.quantity,
            category: normalizedItem.category,
            note: normalizedItem.note,
            updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .select("id, name, quantity, category, note, completed")
        .single();

    if (error) {
        throwFriendlyDuplicateError(error);
    }

    return mapItemRow(data);
}