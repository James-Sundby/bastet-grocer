export default function QuickAdd({
  id,
  name,
  quantity,
  category,
  onDelete,
  onAdd,
}) {
  return (
    <li>
      <div
        className={`card card-compact bg-base-100 shadow-lg rounded-md border border-base-300 `}
      >
        <div className="card-body flex-row justify-between">
          <div>
            <div className="card-title text-2xl pb-2">
              <p>{name}</p>
            </div>
            <p className="text-xl">
              <span className="font-bold">{quantity}</span> in{" "}
              <span className="font-bold capitalize">{category}</span>
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              aria-label="Add to shopping list"
              onClick={(e) => onAdd({ name, quantity, category }, e)}
              className="btn btn-success"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="h-5 w-5">

                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
              </svg>
            </button>
            <button
              aria-label="Delete item"
              onClick={(e) => onDelete(id, e)}
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
