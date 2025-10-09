import React, { useState } from "react";
import { Ban, Eye, Trash2, UserCheck } from "lucide-react";
import WarningModal from "../modals/WarningModal";
import api from "../../utilities/api";
import { toast } from "sonner";
import axios from "axios";
import { formatDateToStyle, formatterUtility } from "../../utilities/formatterutility";
import PaginationControls from "../../utilities/PaginationControls";

const UserTable = ({ users, reFetch, currentPage, lastPage, setCurrentPage }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmDisable = async () => {
    setDisabling(true);
    try {
      const res = await api.put(`/api/admin/users/${currentUser.id}`);
      if (res.status === 200) {
        toast.success(
          `User ${currentUser.username} ${
            currentUser.enabled !== 0 ? "disabled" : "enabled"
          } successfully`
        );
        reFetch();
        setDeleteModalOpen(false);
      } else {
        toast.error(
          `Unable to ${currentUser.enabled !== 0 ? "disable" : "enable"} user ${
            currentUser.username
          }, please try again`
        );
      }
    } catch (error) {
      console.log(error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An unexpected error occurred while disabling user. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during disabling user:", error);
      }
    } finally {
      setDisabling(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await api.delete(`/api/admin/users/${currentUser.id}`);
      if (res.status === 200) {
        toast.success(`User ${currentUser.username} deleted successfully`);
        reFetch();
        setDeleteModalOpen(false);
      } else {
        toast.error(
          `Unable to delete user ${currentUser.username}, please try again`
        );
      }
    } catch (error) {
      console.log(error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "An unexpected error occurred while deleting user. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during deleting user:", error);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-gray-700 font-semibold text-xs">
          <tr>
            <th className="py-3 px-4 text-start">S/N</th>
            <th className="py-3 px-4 text-center">Name</th>
            <th className="py-3 px-4 text-center">Earning</th>
            <th className="py-3 px-4 text-center">Email</th>
            <th className="py-3 px-4 text-center">Username</th>
            <th className="py-3 px-4 text-center">Phone</th>
            <th className="py-3 px-4 text-center whitespace-nowrap">Is Stockist?</th>
            <th className="py-3 px-4 text-center">Account Status</th>
            <th className="py-3 px-4 text-center">Date Joined</th>
            <th className="py-3 px-4 text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(
            (
              {
                first_name,
                last_name,
                mobile,
                stockist_enabled,
                email,
                username,
                enabled,
                created_at,
                earning_wallet,
                id,
              },
              index
            ) => (
              <tr
                key={index}
                className="bg-white cursor-pointer"
                onMouseOver={() =>
                  setCurrentUser({
                    first_name,
                    last_name,
                    mobile,
                    stockist_enabled,
                    email,
                    username,
                    enabled,
                    created_at,
                    earning_wallet,
                    id,
                  })
                }
              >
                <td className="border-y border-black/10 rounded-s-lg border-s-1 lg:py-5 py-3 px-4">
                  {(index + 1).toString().padStart(3, "0")}
                </td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">
                  {first_name} {last_name}
                </td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">
                  {formatterUtility(Number(earning_wallet))}
                </td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">{email}</td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">{username}</td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">{mobile}</td>
                <td className="border-y border-black/10 lg:py-5 py-3 text-center px-4">
                  <span className="text-black font-semibold text-center flex justify-center py-1 px-3 rounded-full text-xs">
                    {stockist_enabled === 0 ? "No" : "Yes"}
                  </span>
                </td>
                <td className="border-y border-black/10 py-2 text-center px-4">
                  <button
                    className={`${
                      enabled !== 0 ? "bg-primary/10" : "bg-red-700 text-white"
                    } text-primary py-1 px-3 rounded-full text-xs`}
                  >
                    {enabled !== 0 ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="border-y border-black/10 py-2 text-center px-4">{formatDateToStyle(created_at)}</td>
                <td className="border-y border-black/10 rounded-e-lg border-e-1 py-6 px-4">
                  <div className="flex gap-4">
                    <button
                      className={`text-primary cursor-pointer`}
                      onClick={() => setDisableModalOpen(true)}
                      title={`${enabled !== 0 ? "Disable" : "Enable"}`}
                    >
                      {enabled !== 0 ? (
                        <Ban size={17} />
                      ) : (
                        <UserCheck size={17} />
                      )}
                    </button>
                    <button
                      title="Delete"
                      className={`text-primary cursor-pointer`}
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={10}>
              <PaginationControls 
                currentPage={currentPage}
                totalPages={lastPage}
                setCurrentPage={setCurrentPage}
              />
            </td>
          </tr>
        </tfoot>
      </table>
      {deleteModalOpen && (
        <WarningModal
          title={`Are you sure you want to delete user ${currentUser.username}?`}
          message={"Confirming the button will delete this user permanently."}
          negativeAction={() => setDeleteModalOpen(false)}
          positiveAction={confirmDelete}
          isPositive={deleting}
        />
      )}
      {disableModalOpen && (
        <WarningModal
          title={`Are you sure you want to ${
            currentUser.enabled !== 0 ? "disable" : "enable"
          } user ${currentUser.username}?`}
          message={`Confirming the button will ${
            currentUser.enabled !== 0 ? "disable" : "enable"
          } this user temporarily.`}
          negativeAction={() => setDisableModalOpen(false)}
          isPositive={disabling}
          positiveAction={confirmDisable}
        />
      )}
    </>
  );
};

export default UserTable;
