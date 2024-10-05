export default function Item({
  id,
  name,
  quantity,
  category,
  completed = false,
  onDelete,
  onStatusChange,
}) {
  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onStatusChange(id, e.target.checked);
  };

  // const getCategoryColor = (category) => {
  //   const colors = {
  //     bakery: "hsl(30, 100%, 60%)",
  //     beverages: "hsl(200, 80%, 60%)",
  //     "canned goods": "hsl(120, 60%, 50%)",
  //     dairy: "hsl(210, 40%, 85%)",
  //     deli: "hsl(30, 70%, 50%)",
  //     "dry goods": "hsl(40, 60%, 70%)",
  //     "frozen foods": "hsl(240, 50%, 70%)",
  //     household: "hsl(0, 0%, 50%)",
  //     meat: "hsl(0, 70%, 50%)",
  //     produce: "hsl(90, 60%, 50%)",
  //     snacks: "hsl(330, 60%, 70%)",
  //     other: "hsl(210, 10%, 40%)",
  //   };

  //   return colors[category] || colors["other"];
  // };
  // const borderColor = getCategoryColor(category);

  //"border-l-4" style={{ borderLeftColor: borderColor }}

  return (
    <li>
      <div
        className={`card card-compact bg-base-100 shadow-lg rounded-md border border-base-300 ${completed ? "opacity-50" : ""}`}>
        <div className="card-body flex-row justify-between">
          <div>
            <div className="card-title text-2xl pb-2">
              <input
                type="checkbox"
                id={`checkbox-${id}`}
                className="checkbox checkbox-lg checkbox-primary mr-2 hover:checkbox-primary hover:brightness-90"
                checked={completed}
                onChange={handleCheckboxChange}
                aria-label={`Mark ${name} as completed`}
              />
              <label htmlFor={`checkbox-${id}`} className="cursor-pointer">
                {name}
              </label>
            </div>
            <p className="text-xl">
              <span className="font-bold">{quantity}</span> in{" "}
              <span className="font-bold capitalize">{category}</span>
            </p>
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
