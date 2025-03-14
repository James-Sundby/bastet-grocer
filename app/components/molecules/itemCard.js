import { useState } from "react";

export default function ItemCard({
    id,
    name,
    quantity,
    category,
    completed = false,
    onDelete,
    onStatusChange,
    onAdd,
    onIncrement,
    onDecrement,
    isQuickAdd = false, // Determines if this is a QuickAdd card or not
}) {
    const [isEditing, setIsEditing] = useState(false);

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onStatusChange?.(id, e.target.checked);
    };

    const handleEditDetails = (e) => {
        e.stopPropagation();
        setIsEditing(e.target.checked);
    };

    return (
        <li>
            <div
                className={`collapse card card-sm  bg-base-100 shadow-lg rounded-md border border-base-300 ${completed ? "opacity-50" : ""}`}>
                <div className="card-body flex-row justify-between">
                    <div>
                        <div className="card-title text-2xl pb-2">
                            {!isQuickAdd && (
                                <input
                                    type="checkbox"
                                    id={`checkbox-${id}`}
                                    className="checkbox checkbox-lg checkbox-primary rounded-md mr-2 hover:checkbox-primary hover:brightness-90"
                                    checked={completed}
                                    onChange={handleCheckboxChange}
                                    aria-label={`Mark ${name} as completed`}
                                />
                            )}
                            <p>{name}</p>
                        </div>
                        <p className="text-xl">
                            <span className="font-bold">{quantity}</span> in{" "}
                            <span className="font-bold capitalize">{category}</span>
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        {isQuickAdd ? (
                            <button
                                aria-label="Add to shopping list"
                                onClick={(e) => onAdd?.({ name, quantity, category }, e)}
                                className="btn btn-primary rounded-md"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    className="h-4 w-4"
                                >
                                    <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                </svg>
                            </button>
                        ) : null}
                        <label
                            htmlFor={`collapse-checkbox-${id}`}
                            aria-label={isEditing ? "Close item panel" : "Open item panel"}
                            className="btn rounded-md"
                        >
                            {isEditing ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="h-4 w-4"
                                >
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                                </svg>

                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="h-4 w-4"
                                >
                                    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
                                </svg>)
                            }
                        </label>
                    </div>
                </div>

                <input
                    type="checkbox"
                    id={`collapse-checkbox-${id}`}
                    className="collapse-checkbox hidden"
                    checked={isEditing}
                    onChange={handleEditDetails}
                />
                <div className={`collapse-content ${isEditing ? "" : "hidden"}`}>

                    <div className="flex gap-4 items-center">
                        <button
                            aria-label="Increment quantity"
                            className="btn btn-sm btn-primary rounded-md"
                            onClick={(e) => onIncrement?.({ id, name }, e, 1)}
                        >
                            + 1
                        </button>
                        {quantity > 1 && (
                            <button
                                aria-label="Decrement quantity"
                                className="btn btn-sm btn-accent rounded-md"
                                onClick={(e) => onDecrement?.({ id, name }, e, -1)}
                            >
                                - 1
                            </button>
                        )}
                        <button
                            aria-label="Delete item"
                            className="btn btn-sm btn-error ml-auto rounded-md"
                            onClick={(e) => onDelete?.({ id, name }, e,)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}
