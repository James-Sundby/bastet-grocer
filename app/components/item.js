export default function Item({
  id,
  name,
  quantity,
  category,
  onDelete,
}) {
  const handleClick = () => {
    onSelect(name);
  };

  return (
    <li onClick={handleClick}>
      <div
        className="card bg-base-200 shadow-xl max-w-lg mx-2 mb-2 hover:bg-base-300 rounded-md"
      >
        <div className="card-body flex-row justify-between">
          <div>
            <header className="card-title text-2xl pb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-lg checkbox-primary mr-2"
                onClick={(e) => e.stopPropagation()}
              />
              {name}
            </header>
            <article>
              Pick up <span className="font-bold text-primary">{quantity}</span>{" "}
              in{" "}
              <span className="font-bold text-primary capitalize">
                {category}
              </span>
            </article>
          </div>
          <div className="flex items-center">
            <button
              aria-label="Delete item"
              onClick={(e) => onDelete(id, e)}
              className="btn btn-primary hidden md:inline-flex"
            >
              Remove
            </button>
            <button
              aria-label="Delete item"
              onClick={(e) => onDelete(id, e)}
              className="btn btn-primary md:hidden"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
