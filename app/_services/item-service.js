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

    const category = item.category?.trim().toLowerCase();

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
        updatedAt: row.updated_at,
    };
}

function throwFriendlyDuplicateError(error) {
    if (error?.code === "23505") {
        throw new Error("That item is already on this list.");
    }

    throw error;
}

export async function getShoppingList(supabase, listId) {
    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { data, error } = await supabase
        .from("items")
        .select("id, name, quantity, category, note, completed, updated_at")
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

    const { data, error } = await supabase
        .rpc("add_or_increment_item", {
            p_list_id: listId,
            p_name: normalizedItem.name,
            p_quantity: normalizedItem.quantity,
            p_category: normalizedItem.category,
            p_note: normalizedItem.note,
            p_completed: normalizedItem.completed,
        })
        .single();

    if (error) {
        throw error;
    }

    return mapItemRow(data);
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

    const { data, error } = await supabase
        .from("items")
        .update({
            completed,
            updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .select("id, completed, updated_at")
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        completed: data.completed,
        updatedAt: data.updated_at,
    };
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

    const { data, error } = await supabase.rpc("clear_completed_items", {
        p_list_id: listId,
    });

    if (error) {
        throw error;
    }

    return data ?? 0;
}

export async function incrementDecrementItem(supabase, itemId, value) {
    if (value !== 1 && value !== -1) {
        throw new Error("Value must be either 1 or -1.");
    }

    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { data, error } = await supabase
        .rpc("change_item_quantity", {
            p_item_id: itemId,
            p_delta: value,
        })
        .single();

    if (error) {
        throw error;
    }

    return {
        id: data.id,
        quantity: data.quantity,
        updatedAt: data.updated_at,
    };
}

export async function updateItem(supabase, itemId, item, expectedUpdatedAt) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    if (!expectedUpdatedAt) {
        throw new Error("This item is out of date. Refresh the list and try again.");
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
        .eq("updated_at", expectedUpdatedAt)
        .select("id, name, quantity, category, note, completed, updated_at")
        .maybeSingle();

    if (error) {
        throwFriendlyDuplicateError(error);
    }

    if (!data) {
        throw new Error(
            "Someone else changed this item. Refresh the list and try again."
        );
    }

    return mapItemRow(data);
}