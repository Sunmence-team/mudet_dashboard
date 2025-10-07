import React, { useEffect, useRef, useState } from "react";
import SearchInput from "../../components/SearchInput";
import UserTable from "../../components/tables/UserTable";
import api from "../../utilities/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const searchRef = useRef(null);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await api.get("/api/admin/users");
      const resData = res.data.data.data;
      const usersToDisplay = resData.filter((data) => {
        return data.role !== "admin";
      });
      setUsers(usersToDisplay);
      setAllUsers(usersToDisplay);
      console.log(usersToDisplay);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingUsers(false);
    }
  };

  // const handleToggleDetails = (user) => {
  //   // user = {..., earning:"****"}
  // };

  const searchAction = () => {
    try {
      const value = searchRef.current.value.trim().toLowerCase();

      if (!value) {
        setUsers(allUsers);
        return;
      }

      const searchUser = allUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(value) ||
          user.username.toLowerCase().includes(value)
      );

      setUsers(searchUser);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (fetchingUsers) {
    return (
      <div className="flex flex-col gap-4 p-6 justify-center items-center min-h-[400px]">
        <h3 className="text-2xl font-semibold">Fetching Users</h3>
        <div className="border-[6px] border-t-transparent border-pryClr animate-spin mx-auto rounded-full w-[80px] h-[80px]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex lg:justify-end md:justify-end sm:justify-start">
        <SearchInput
          placeholder={"Search users by user name or email"}
          ref={searchRef}
          searchAction={searchAction}
        />
      </div>
      <div className="w-full overflow-x-auto">
        <UserTable users={users} reFetch={fetchUsers}/>
      </div>
    </div>
  );
};

export default Users;
