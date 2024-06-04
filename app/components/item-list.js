"use client";

import { useState } from "react";
import Item from "./item.js";

export default function ItemList({ items, onDelete, onItemSelect }) {
  const [sortBy, setSortBy] = useState("category");
  const itemsData = [...items];

  // Adapted from provided Youtube video https://www.youtube.com/watch?v=s1XVfm5mIuU from Web Dev Simplified
  // const groupedItems = items.reduce((group, item) => {
  //   const category = item.category;
  //   if (group[category] == null) {
  //     group[category] = [];
  //   }
  //   group[category].push(item);
  //   group[category].sort((a, b) => a.name.localeCompare(b.name));
  //   return group;
  // }, {});

  if (sortBy === "name") {
    itemsData.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "category") {
    itemsData.sort((a, b) => a.category.localeCompare(b.category));
  }

  return (
    <>
      <div className="mx-2 max-w-lg mb-2">
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

          {/* <input
            className="join-item btn flex-1"
            type="radio"
            name="sort-options"
            aria-label="Sort by Grouped Categories"
            onClick={() => setSortBy("grouped")}
          /> */}
        </div>
      </div>
      {(sortBy === "name" || sortBy === "category") && (
        <ul>
          {itemsData.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              quantity={item.quantity}
              category={item.category}
              onDelete={onDelete}
              onSelect={onItemSelect}
            />
          ))}
        </ul>
      )}
      {sortBy === "grouped" && (
        <div>
          {Object.keys(groupedItems)
            .sort()
            .map((category) => (
              <div className="py-2" key={category}>
                <h3 className="capitalize font-bold pl-2">{category}</h3>
                <ul>
                  {groupedItems[category].map((item) => (
                    <Item
                      key={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      category={item.category}
                      onDelete={onDelete}
                      onSelect={onItemSelect}
                    />
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
