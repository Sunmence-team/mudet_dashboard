// import React, { useEffect, useRef, useState } from "react";
// import SearchInput from "../../components/SearchInput";
// import UserTable from "../../components/tables/UserTable";
// import api from "../../utilities/api";
// import LazyLoader from "../../components/LazyLoader";
// import { useUser } from "../../context/UserContext";

// const Users = () => {
//   const { token } = useUser()
//   const [users, setUsers] = useState([]);
//   const [fetchingUsers, setFetchingUsers] = useState(false);
//   const searchRef = useRef(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);

//   const fetchUsers = async () => {
//     setFetchingUsers(true);
//     try {
//       const res = await api.get("/api/admin/users", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       // console.log("user response", res);
//       if (res.status === 200 && res.data.status === "success") {
//         const { data, current_page, last_page } = res.data.data;
//         const usersToDisplay = data.filter((data) => {
//           return data.role !== "admin";
//         });
//         setUsers(usersToDisplay);
//         setCurrentPage(current_page)
//         setLastPage(last_page)
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setFetchingUsers(false);
//     }
//   };

//   const searchAction = () => {
//     try {
//       const value = searchRef.current.value.trim().toLowerCase();

//       if (!value) {
//         setUsers(allUsers);
//         return;
//       }

//       const searchUser = allUsers.filter(
//         (user) =>
//           user.email.toLowerCase().includes(value) ||
//           user.username.toLowerCase().includes(value)
//       );

//       setUsers(searchUser);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [token]);

//   if (fetchingUsers) {
//     return (
//       <div className="flex flex-col gap-4 p-6 justify-center items-center min-h-[400px]">
//         <h3 className="text-2xl font-semibold">Fetching Users</h3>
//         <LazyLoader width={80} color={"green"} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex lg:justify-end md:justify-end sm:justify-start">
//         <SearchInput
//           placeholder={"Search users by user name or email"}
//           ref={searchRef}
//           searchAction={searchAction}
//         />
//       </div>
//       <div className="w-full overflow-x-auto styled-scrollbar">
//         <UserTable
//           users={users}
//           reFetch={fetchUsers}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           lastPage={lastPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default Users;

import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchInput from "../../components/SearchInput";
import UserTable from "../../components/tables/UserTable";
import api from "../../utilities/api";
import LazyLoader from "../../components/loaders/LazyLoader";
import { useUser } from "../../context/UserContext";

const Users = () => {
  const { token } = useUser();
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchUsers = async (query = "") => {
    setFetchingUsers(true);
    try {
      const res = await api.get(`/api/admin/users${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.status === "success") {
        const { data, current_page, last_page } = res.data.data;
        const usersToDisplay = data.filter((u) => u.role !== "admin");
        setUsers(usersToDisplay);
        setCurrentPage(current_page);
        setLastPage(last_page);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingUsers(false);
    }
  };

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (!value.trim()) {
        fetchUsers();
        return;
      }
      fetchUsers(`?username=${encodeURIComponent(value)}`);
    }, 500),
    [token]
  );

  useEffect(() => {
    fetchUsers();
  }, [token]);

  if (fetchingUsers) {
    return (
      <div className="flex flex-col gap-4 p-6 justify-center items-center min-h-[400px]">
        <h3 className="text-2xl font-semibold">Fetching Users</h3>
        <LazyLoader width={60} color={"green"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex lg:justify-end md:justify-end sm:justify-start">
        <SearchInput
          placeholder="Search users by username"
          searchAction={debouncedSearch}
        />
      </div>

      <div className="w-full overflow-x-auto styled-scrollbar">
        <UserTable
          users={users}
          reFetch={fetchUsers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
        />
      </div>
    </div>
  );
};

export default Users;
