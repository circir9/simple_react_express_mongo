import React from "react";

const Select = ({ options, setSelectInputValue }) => {
  return (
    <select className="select-option" onChange={(e) => setSelectInputValue(e.target.value)}>
        {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
  );
};

export default Select;