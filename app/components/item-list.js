"use client";

import { useState } from "react";
import Item from "./item.js";

export default function ItemList({ items, onDelete, onStatusChange, onItemSelect }) {
  const [sortBy, setSortBy] = useState("category");

  let itemsData = [...items];

  itemsData.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "category") {
      const categoryComparison = a.category.localeCompare(b.category);
      if (categoryComparison !== 0) {
        return categoryComparison;
      }
      return a.name.localeCompare(b.name);
    }

    return 0; // Fallback case, in case sortBy is not "name" or "category"
  });
  return (
    <>
      <div className="mb-2 mx-4">
        <div className="join flex">
          <input
            className="join-item btn flex-1"
            type="radio"
            name="sort-options"
            aria-label="Sort by Category"
            onClick={() => setSortBy("category")}
            defaultChecked
          />
          <input
            className="join-item btn flex-1"
            type="radio"
            name="sort-options"
            aria-label="Sort by Name"
            onClick={() => setSortBy("name")}
          />
        </div>
      </div>
      {(sortBy === "name" || sortBy === "category") && (
        <ul className="flex flex-col gap-2 mx-4">
          {itemsData.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              completed={item.completed}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onSelect={onItemSelect}
            />
          ))}
        </ul>
      )}
    </>
  );
}