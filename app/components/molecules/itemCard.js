export default function ItemCard({
    id,
    name,
    quantity,
    category,
    completed = false,
    onDelete,
    onStatusChange,
    onAdd,
    isQuickAdd = false, // Determines if this is a QuickAdd card or not
}) {
    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onStatusChange?.(id, e.target.checked);
    };

    return (
        <li>
            <div
                className={`card card-compact bg-base-100 shadow-lg rounded-md border border-base-300 ${completed ? "opacity-50" : ""
                    }`}
            >
                <div className="card-body flex-row justify-between">
                    <div>
                        <div className="card-title text-2xl pb-2">
                            {!isQuickAdd && (
                                <input
                                    type="checkbox"
                                    id={`checkbox-${id}`}
                                    className="checkbox checkbox-lg checkbox-primary mr-2 hover:checkbox-primary hover:brightness-90"
                                    checked={completed}
                                    onChange={handleCheckboxChange}
                                    aria-label={`Mark ${name} as completed`}
                                />
                            )}
                            <label htmlFor={`checkbox-${id}`} className="cursor-pointer">
                                {name}
                            </label>
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
                                className="btn btn-primary"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    className="h-5 w-5"
                                >
                                    <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                                </svg>
                            </button>
                        ) : null}
                        <button
                            aria-label="Delete item"
                            onClick={(e) => onDelete?.(id, e)}
                            className="btn btn-error"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="h-5 w-5"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}
