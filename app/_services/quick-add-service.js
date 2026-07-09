function normalizeNameKey(name) {
    return name.trim().toLowerCase();
}

function normalizeQuickAddItem(item) {
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
    };
}

function mapQuickAddRow(row) {
    return {
        id: row.id,
        name: row.name,
        quantity: row.quantity,
        category: row.category,
        note: row.note ?? "",
    };
}

function mapShoppingListRow(row) {
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
        throw new Error("That item is already in your quick adds.");
    }

    throw error;
}

export async function getQuickAddItems(supabase) {
    const { data, error } = await supabase
        .from("quick_add_items")
        .select("id, name, quantity, category, note")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        throw error;
    }

    return data.map(mapQuickAddRow);
}

export async function addQuickAddItem(supabase, item) {
    const normalizedItem = normalizeQuickAddItem(item);

    const { data: existingItem, error: findError } = await supabase
        .from("quick_add_items")
        .select("id, quantity, note")
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
            .from("quick_add_items")
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
        .from("quick_add_items")
        .insert(normalizedItem)
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

export async function removeQuickAddItem(supabase, itemId) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { error } = await supabase
        .from("quick_add_items")
        .delete()
        .eq("id", itemId);

    if (error) {
        throw error;
    }

    return itemId;
}

export async function incrementDecrementQuickAdd(supabase, itemId, value) {
    if (value !== 1 && value !== -1) {
        throw new Error("Value must be either 1 or -1.");
    }

    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const { data: currentItem, error: findError } = await supabase
        .from("quick_add_items")
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
        .from("quick_add_items")
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

export async function updateQuickAddItem(supabase, itemId, item) {
    if (!itemId) {
        throw new Error("Item ID is required.");
    }

    const normalizedItem = normalizeQuickAddItem(item);

    const { data, error } = await supabase
        .from("quick_add_items")
        .update({
            name: normalizedItem.name,
            name_key: normalizedItem.name_key,
            quantity: normalizedItem.quantity,
            category: normalizedItem.category,
            note: normalizedItem.note,
            updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .select("id, name, quantity, category, note")
        .single();

    if (error) {
        throwFriendlyDuplicateError(error);
    }

    return mapQuickAddRow(data);
}

export async function addQuickAddToShoppingList(
    supabase,
    quickAddId,
    listId
) {
    if (!quickAddId) {
        throw new Error("Quick add ID is required.");
    }

    if (!listId) {
        throw new Error("List ID is required.");
    }

    const { data, error } = await supabase
        .rpc("add_quick_add_to_list", {
            p_quick_add_id: quickAddId,
            p_list_id: listId,
        })
        .single();

    if (error) {
        throw error;
    }

    return mapShoppingListRow(data);
}