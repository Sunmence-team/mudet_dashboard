import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchInput = ({ searchAction }) => {
  return (
    <div className="lg:border border-[#000000]/40 flex items-center justify-between py-2 px-4 text-[#000000]/90  rounded-[8px]">
      <input
        type="text"
        placeholder="Search"
        className="border-0 outline-0 w-[250px] lg:block hidden"
        onInput={searchAction}
      />
      <FaMagnifyingGlass className="text-[#000000]/40 lg:text-base text-2xl" />
    </div>
  );
};

export default SearchInput;
