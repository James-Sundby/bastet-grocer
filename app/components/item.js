export default function Item({
  id,
  name,
  quantity,
  category,
  onDelete,
}) {
  // const handleClick = () => {
  //   onSelect(name);
  // };

  return (
    <li /*onClick={handleClick}*/>
      <div
        className="card bg-base-100 shadow-xl max-w-lg mx-2 mb-2 rounded-md border border-base-300 hover:bg-base-200"
      >
        <div className="card-body flex-row justify-between">
          <div>
            <header className="card-title text-2xl pb-2">
              <input
                type="checkbox"
                className="checkbox checkbox-lg checkbox-accent mr-2"
                onClick={(e) => e.stopPropagation()}
              />
              {name}
            </header>
            <article className="text-lg">
              <span className="font-bold ">{quantity}</span>{" "}
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
              className="btn btn-accent hidden md:inline-flex"
            >
              Remove
            </button>
            <button
              aria-label="Delete item"
              onClick={(e) => onDelete(id, e)}
              className="btn btn-accent md:hidden"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
