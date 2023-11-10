import React, { useState } from "react";

interface Props {
  items: Array<string>;
  toggledItems: Array<string>;
  onCheckboxChange: (toggledItems: Array<string>) => void;
}

export function CheckboxList({ items, toggledItems, onCheckboxChange }: Props) {
  const handleCheckboxChange = (item: string) => {
    let returnArray: Array<string> = [];
    if (toggledItems.includes(item)) {
      returnArray = toggledItems.filter(
        (check: string) => check.valueOf() !== item.valueOf()
      );
    } else {
      returnArray = [...toggledItems, item];
    }

    onCheckboxChange(returnArray);
  };

  return (
    <div className="distributor-checkbox-list">
      {items.map((item: string) => (
        <label key={item} className="distributor-checkbox-item">
          <input
            type="checkbox"
            checked={toggledItems.includes(item)}
            onChange={() => handleCheckboxChange(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
