import React from "react";
import SearchInput from "../../components/SearchInput";
import UserTable from "../../components/tables/UserTable";

const Users = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex lg:justify-end md:justify-end sm:justify-start">
        <SearchInput placeholder={"Search users by user name or email"} />
      </div>
      <div className="w-full overflow-x-auto">
        <UserTable />
      </div>
    </div>
  );
};

export default Users;
