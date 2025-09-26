import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchInput = ({ searchAction,placeholder }) => {
  return (
    <div className="border border-[#000000]/40 flex items-center justify-between py-2 px-5 text-[#000000]/90  rounded-[8px]">
      <input
        type="text"
        placeholder={placeholder ? placeholder : "Search"}
        className="border-0 outline-0 w-[250px] text-sm"
        onInput={searchAction}
      />
      <FaMagnifyingGlass className="text-[#000000]/40 text-base" />
    </div>
  );
};

export default SearchInput;
