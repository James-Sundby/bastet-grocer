"use client";

import ItemEditor from "./itemEditor";

export default function ItemSidebar({
    selectedItem,
    copy,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onCancelEdit,
    suggestCategory,
    rememberCategoryPreference,
    footer,
}) {
    return (
        <aside className="min-h-0 overflow-y-auto border-r border-base-300 bg-base-100">
            <div className="flex min-h-full flex-col gap-6 p-5">
                <ItemEditor
                    key={
                        selectedItem?.id ??
                        "new"
                    }
                    item={selectedItem}
                    copy={copy}
                    onAddItem={onAddItem}
                    onUpdateItem={
                        onUpdateItem
                    }
                    onDeleteItem={
                        onDeleteItem
                    }
                    onCancelEdit={
                        onCancelEdit
                    }
                    suggestCategory={
                        suggestCategory
                    }
                    rememberCategoryPreference={
                        rememberCategoryPreference
                    }
                />

                {footer && (
                    <div className="mt-auto border-t border-base-300 pt-5">
                        {footer}
                    </div>
                )}
            </div>
        </aside>
    );
}