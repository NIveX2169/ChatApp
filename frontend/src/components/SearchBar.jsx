import React from "react";

const SearchBar = () => {
  return (
    <div className="py-4 h-[80px] ">
      <input
        type="text"
        value=""
        placeholder=" Search For People"
        className=" w-full placeholder:text-center h-full rounded-md text-white bg-[#202C33] border-dotted border-white"
      />
    </div>
  );
};

export default SearchBar;
