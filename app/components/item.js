export default function Item({
  id,
  name,
  quantity,
  category,
  completed,
  onDelete,
  onStatusChange,
}) {
  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onStatusChange(id, e.target.checked);
  };

  return (
    <li>
      <div
        className={`card bg-base-100 shadow-lg max-w-lg mx-4 mb-2 rounded-md border border-base-300 hover:bg-base-200 ${completed ? "opacity-50" : ""}`}
      >
        <div className="card-body flex-row justify-between">
          <div>
            <header className="card-title text-2xl pb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-lg checkbox-primary mr-2"
                checked={completed}
                onChange={handleCheckboxChange}
              />
              {name}
            </header>
            <article className="text-xl">
              <span className="font-bold">{quantity}</span>{" "}
              in{" "}
              <span className="font-bold capitalize">
                {category}
              </span>
            </article>
          </div>
          <div className="flex items-center">
            <button
              aria-label="Delete item"
              onClick={(e) => onDelete(id, e)}
              className="btn btn-error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="h-5 w-5"
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