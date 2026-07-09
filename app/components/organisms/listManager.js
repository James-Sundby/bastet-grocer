"use client";

import { useState } from "react";

export default function ListManager({
    lists,
    activeList,
    activeListId,
    onSelectList,
    onCreateList,
    onRenameList,
    onDeleteList,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [renameTitle, setRenameTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const activeTitle = activeList?.title ?? "";
    const trimmedNewListTitle = newListTitle.trim();
    const trimmedRenameTitle = renameTitle.trim();
    const isBusy = isCreating || isRenaming || isDeleting;

    const openModal = () => {
        setNewListTitle("");
        setRenameTitle(activeTitle);
        setIsConfirmingDelete(false);
        setIsOpen(true);
    };

    const closeModal = () => {
        if (isBusy) return;

        setIsOpen(false);
        setIsConfirmingDelete(false);
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        if (!trimmedNewListTitle) return;

        setIsCreating(true);

        try {
            const newList = await onCreateList(trimmedNewListTitle);

            if (newList) {
                setNewListTitle("");
                setRenameTitle(newList.title);
                setIsConfirmingDelete(false);
                setIsOpen(false);
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleRename = async (event) => {
        event.preventDefault();

        if (
            !activeListId ||
            !trimmedRenameTitle ||
            trimmedRenameTitle === activeTitle.trim()
        ) {
            return;
        }

        setIsRenaming(true);

        try {
            const renamedList = await onRenameList(
                activeListId,
                trimmedRenameTitle
            );

            if (renamedList) {
                setRenameTitle(renamedList.title);
                setIsConfirmingDelete(false);
            }
        } finally {
            setIsRenaming(false);
        }
    };

    const handleSelectList = (event) => {
        const nextListId = event.target.value;

        if (!nextListId || nextListId === activeListId) return;

        onSelectList(nextListId);
        setIsOpen(false);
        setIsConfirmingDelete(false);
    };

    const handleDelete = async () => {
        if (!activeListId || lists.length <= 1) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }

        setIsDeleting(true);

        try {
            const deletedListId = await onDeleteList(activeListId);

            if (deletedListId) {
                setIsOpen(false);
                setIsConfirmingDelete(false);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-outline h-auto px-4 py-2"
                onClick={openModal}
            >
                Manage lists
            </button>

            <div
                className={`modal ${isOpen ? "modal-open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="list-manager-title"
            >
                <div className="modal-box max-h-[85vh] w-[92vw] max-w-md overflow-y-auto text-left">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3
                                id="list-manager-title"
                                className="text-xl font-bold"
                            >
                                Manage lists
                            </h3>

                            <p className="mt-1 text-sm text-base-content/70">
                                Switch lists, create a new list, or edit the current one.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-circle"
                            onClick={closeModal}
                            disabled={isBusy}
                            aria-label="Close list manager"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-4">
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text font-bold">
                                    Current list
                                </span>
                            </div>

                            <select
                                className="select select-bordered w-full"
                                value={activeListId ?? ""}
                                onChange={handleSelectList}
                                disabled={isBusy}
                            >
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.title}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <form className="form-control w-full" onSubmit={handleCreate}>
                            <div className="label">
                                <span className="label-text font-bold">
                                    Create list
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newListTitle}
                                    onChange={(event) =>
                                        setNewListTitle(event.target.value)
                                    }
                                    className="input input-bordered min-w-0 flex-1"
                                    placeholder="Costco run"
                                    maxLength={50}
                                    disabled={isBusy}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-primary h-auto px-4 py-2"
                                    disabled={isBusy || !trimmedNewListTitle}
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>

                        <details className="collapse collapse-arrow rounded-md bg-base-200/60">
                            <summary className="collapse-title font-bold">
                                Edit current list
                            </summary>

                            <div className="collapse-content space-y-4">
                                <form onSubmit={handleRename}>
                                    <label className="form-control w-full">
                                        <div className="label">
                                            <span className="label-text font-bold">
                                                Rename list
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={renameTitle}
                                                onChange={(event) => {
                                                    setRenameTitle(event.target.value);
                                                    setIsConfirmingDelete(false);
                                                }}
                                                className="input input-bordered min-w-0 flex-1"
                                                maxLength={50}
                                                disabled={isBusy || !activeListId}
                                            />

                                            <button
                                                type="submit"
                                                className="btn btn-outline h-auto px-4 py-2"
                                                disabled={
                                                    isBusy ||
                                                    !trimmedRenameTitle ||
                                                    trimmedRenameTitle === activeTitle.trim()
                                                }
                                            >
                                                {isRenaming ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    </label>
                                </form>

                                <div className="rounded-md bg-error/10 p-3">
                                    <p className="font-bold text-error">
                                        Delete current list
                                    </p>

                                    <p className="mt-1 text-sm text-base-content/70">
                                        Deleting a list also removes the items on that list.
                                    </p>

                                    {isConfirmingDelete && (
                                        <p className="mt-3 text-sm font-medium text-error">
                                            Click confirm to permanently delete{" "}
                                            <span className="font-bold">
                                                {activeTitle || "this list"}
                                            </span>
                                            .
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        className={`btn mt-3 w-full h-auto px-4 py-2 ${isConfirmingDelete
                                            ? "btn-error"
                                            : "btn-error btn-outline"
                                            }`}
                                        disabled={isBusy || lists.length <= 1}
                                        onClick={handleDelete}
                                    >
                                        {lists.length <= 1
                                            ? "Can’t delete only list"
                                            : isDeleting
                                                ? "Deleting..."
                                                : isConfirmingDelete
                                                    ? "Confirm delete"
                                                    : "Delete list"}
                                    </button>

                                    {isConfirmingDelete && (
                                        <button
                                            type="button"
                                            className="btn btn-ghost mt-2 w-full h-auto px-4 py-2"
                                            onClick={() =>
                                                setIsConfirmingDelete(false)
                                            }
                                            disabled={isBusy}
                                        >
                                            Cancel delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </details>
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn h-auto px-4 py-2"
                            onClick={closeModal}
                            disabled={isBusy}
                        >
                            Close
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="modal-backdrop"
                    aria-label="Close"
                    onClick={closeModal}
                    disabled={isBusy}
                />
            </div>
        </>
    );
}