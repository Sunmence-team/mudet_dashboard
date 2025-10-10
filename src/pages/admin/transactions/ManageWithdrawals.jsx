import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { formatISODateToCustom, formatISODateToReadable, formatterUtility } from "../../../utilities/formatterutility";
import { FaFileCsv } from "react-icons/fa6";
import { fetchPaystackBanks, getBankCode } from "../../../utilities/paystackHelper";
import { useUser } from "../../../context/UserContext";
import LazyLoader from "../../../components/LazyLoader";
import api from "../../../utilities/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageWithdrawals = () => {
   const { token, logout } = useUser();
    const [ManageWithdrawalss, setManageWithdrawalss] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [isDownloadingList, setIsDownloadingList] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const [banks, setBanks] = useState([]);
    useEffect(() => {
        const loadBanks = async () => {
            const list = await fetchPaystackBanks();
            setBanks(list);
        };
        loadBanks();
    }, []);


    // flow state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedData, setSelectedData] = useState([]);

    const [pin, setPin] = useState(Array(4).fill(""));
    const [isPinSubmitting, setIsPinSubmitting] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const fetchManageWithdrawalsals = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/api/all/withdraw`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("all withdraw Response:", response);

            if (response.status === 200 && response.data.success) {
                const { data } = response.data;
                setManageWithdrawalss(data);
            } else {
                throw new Error(response.data.message || "Failed to fetch withdraw list.");
            }
        } catch (error) {
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            toast.error(error.response?.data?.message || "An error occurred fetching withdraw list!.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchManageWithdrawalsals();
    }, [token]);

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    // const handleListDownloadAsCSV = async (data) => {
    //     if (!data || data.length === 0) return;

    //     setIsDownloadingList(true);

    //     try {
    //         await new Promise(resolve => setTimeout(resolve, 2000));

    //         const headers = [
    //             "Transfer Amount",
    //             "Transfer Note",
    //             "Transfer Reference",
    //             "Recipient Code",
    //             "Bank Code",
    //             "Account Number",
    //             "Account Name",
    //             "Email Address"
    //         ];

    //         const rows = data.map((item, idx) => [
    //             item.amount || "-",
    //             "this note is from wellthrix",
    //             item.ref_no || "-",
    //             "",
    //             getBankCode(item.bank_name, banks),
    //             item.account_number || "-",
    //             item.account_name || "-",
    //             item.user_email || "-",

    //             // formatISODateToReadable(item?.created_at),
    //             // formatISODateToReadable(item?.created_at),
    //             // "",
    //             // item.bank_name || "-",
    //             // "NGN",
    //             // item.account_name || "-",
    //             // item.account_number || "-",
    //             // ""
    //         ]);

    //         const csvContent = [
    //             headers.join(","),
    //             ...rows.map(row =>
    //                 row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
    //             )
    //         ].join("\n");

    //         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //         const url = URL.createObjectURL(blob);
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.download = `withdrawals_for_${formatISODateToCustom(Date.now()).split(" ")[0]}.csv`;
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         URL.revokeObjectURL(url);

    //     } catch (error) {
    //         console.error("Error generating CSV:", error);
    //         toast.error("Failed to download withdrawal list. Please try again.");
    //     } finally {
    //         setIsDownloadingList(false);
    //     }
    // };

    const handleListDownloadAsCSV = async (data) => {
        if (!data || data.length === 0) return;

        setIsDownloadingList(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const headers = [
                "#No",
                "Bene.Name",
                "Bene.Name in Bank",
                "Trans. Date",
                "Value. Date",
                "Trans. Ref",
                "Bene.Code",
                "Bene. Bank",
                "Bene. Account",
                "CUR.",
                "Amount",
                "Debit Account Name",
                "Debit Account No",
                "Reason"
            ];

            const rows = data.map((item, idx) => [
                String(idx + 1).padStart(3, "0"),
                item.user_name || "-",
                item.account_name || "-",
                formatISODateToReadable(item?.created_at),
                formatISODateToReadable(item?.created_at),
                item.ref_no || "-",
                "",
                item.bank_name || "-",
                item.account_number || "-",
                "NGN",
                item.amount || "-",
                item.account_name || "-",
                item.account_number || "-",
                ""
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map(row =>
                    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
                )
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `withdrawals_for_${formatISODateToCustom(Date.now()).split(" ")[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating CSV:", error);
            toast.error("Failed to download withdrawal list. Please try again.");
        } finally {
            setIsDownloadingList(false);
        }
    };

    const handleDatePayout = async (date, data, pinCode) => {
        if (!data || data.length === 0) return;

        setIsPaying(true);
        const toastId = toast.loading(`Initiating payouts for ${date}...`);

        try {
            const response = await api.post(`/api/withdraw/process-weekly`, {
                pin: pinCode,
                // withdrawals: data.map((item) => ({
                //     account_name: item.account_name,
                //     account_number: item.account_number,
                //     amount: item.amount,
                //     bank_name: item.bank_name,
                //     ref_no: item.ref_no,
                //     withdraw_id: item.id,
                // })),
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message || `Withdrawals for ${date} paid successfully`, { id: toastId });
                fetchManageWithdrawalsals();
            } else {
                throw new Error(response.data.message || `Failed to initiate withdrawal for ${date}.`);
            }
        } catch (error) {
            console.error("Failed to initiate withdrawal : ", error)
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
            }
            toast.error(error.response?.data?.message || "An error occurred paying withdrawal!.", { id: toastId });
        } finally {
            setIsPaying(false);
        }
    };

    const handlePinChange = (index, value) => {
        if (/^[0-9]?$/.test(value)) {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next field
        if (value && index < 5) {
            document.getElementById(`pin-input-${index + 1}`).focus();
        }
        }
    };

    const isPinComplete = pin.every((digit) => digit !== "");

    return (
        <div className="space-y-6">
            {
                isLoading ? (
                    <LazyLoader 
                        width={80}
                        color={"green"}
                    />
                ) : (
                    Object.entries(ManageWithdrawalss).map(([date, data], index) => (
                        <div key={index} className="">
                            <div
                                className={`flex md:flex-row flex-col gap-4 md:items-center items-start justify-between w-full px-5 py-3 font-medium text-left text-gray-800 transition-colors border border-primary/20 rounded-lg cursor-pointer bg-white`}
                            >
                                <div className="flex items-center justify-between md:w-max w-full">
                                    <span className="text-sm md:text-lg font-semibold">{date}</span>
                                    {date === today && (
                                        <button
                                            type="button"
                                            disabled={isPaying}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedData(data);
                                                setShowConfirmModal(true);
                                            }}
                                            className="md:hidden block bg-primary h-[40px] px-4 rounded-md cursor-pointer text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isPaying ? 'Paying...' : 'Pay All'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    {date === today && (
                                        <button
                                            type="button"
                                            disabled={isPaying}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedData(data);
                                                setShowConfirmModal(true);
                                            }}
                                            className="md:block hidden bg-primary h-[40px] px-4 rounded-md cursor-pointer text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isPaying ? 'Paying...' : 'Pay All'}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => toggleAccordion(index)}
                                        className="bg-primary text-tetiary h-[40px] px-4 rounded-md cursor-pointer"
                                    >
                                        {activeAccordion === index ? 'Collapse' : 'Expand'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleListDownloadAsCSV(data)}
                                        disabled={isDownloadingList || isPaying}
                                        className={`bg-primary text-tetiary h-[40px] px-4 rounded-md flex items-center gap-1 cursor-pointer ${isDownloadingList ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {isDownloadingList ? 'Downloading...' : 'Download list'}
                                        <FaFileCsv />
                                    </button>
                                </div>
                            </div>
                            <div className={`overflow-x-auto transition-all duration-200 overflow-hidden styled-scrollbar ${activeAccordion === index ? 'max-h-max' : 'max-h-0'}`}>
                                <table key={index} className="min-w-full">
                                    <thead>
                                        <tr className="text-black/70 text-xs whitespace-nowrap uppercase border-b border-black/20">
                                            <th className="py-5 px-3 text-start">S/N</th>
                                            <th className="p-5 text-center">Username</th>
                                            <th className="p-5 text-center">Email</th>
                                            <th className="p-5 text-center">Amount</th>
                                            <th className="p-5 text-center">Bank Name</th>
                                            <th className="p-5 text-center">Account Number</th>
                                            <th className="p-5 text-center">Account Name</th>
                                            <th className="py-5 px-3 text-end">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.length > 0 ? (
                                                data.map((item, index) => {
                                                    return (
                                                        <tr
                                                            key={`${item.id}${index}${item?.user_email}`}
                                                            className="bg-white rounded-xl text-xs text-center"
                                                        >
                                                            <td className="p-3 text-start rounded-s-lg border-y border-s-1 border-black/10">{String(index+1).padStart(3, "0")}</td>
                                                            <td className="p-4 border-y border-black/10">{item?.user_name || "-"}</td>
                                                            <td className="p-4 border-y border-black/10">{item?.user_email || "-"}</td>
                                                            <td className="p-4 border-y border-black/10">{formatterUtility(Number(item?.amount)) || "-"}</td>
                                                            <td className="p-4 border-y border-black/10">{item?.bank_name || "-"}</td>
                                                            <td className="p-4 border-y border-black/10">{item?.account_number || "-"}</td>
                                                            <td className="p-4 border-y border-black/10">{item?.account_name || "-"}</td>
                                                            <td className="p-4 text-end text-sm text-pryClr font-semibold border-e-1 rounded-e-lg border-y border-black/10">{formatISODateToReadable(item?.created_at) || "-"}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr className="bg-white text-sm text-center">
                                                    <td colSpan="8" className="border p-4 rounded-lg border-black/10">No withdrawal request found.</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                    {data.length > 0 && (
                                        <tfoot>
                                            <tr className="font-bold rounded-xl bg-white text-center">
                                                <td colSpan={8} className="p-4 border border-black/10 rounded-lg">
                                                    TOTAL:
                                                    {formatterUtility(
                                                    data.reduce((sum, item) => sum + Number(item?.amount || 0), 0)
                                                    )}
                                                </td>
                                                <td colSpan="4"></td>
                                            </tr>
                                        </tfoot>
                                        )}
                                </table>
                            </div>
                        </div>
                    ))
                )
            }


            {showConfirmModal && (
                <Modal onClose={() => setShowConfirmModal(false)}>
                    <ConfirmationDialog
                        title="Confirm Withdrawal"
                        message={`Are you sure you want to pay all pending withdrawals for ${selectedDate}?`}
                        onCancel={() => setShowConfirmModal(false)}
                        onConfirm={() => {
                            setShowConfirmModal(false);
                            setShowPinModal(true);
                        }}
                        type="confirm"
                    />
                </Modal>
            )}

            {showPinModal && (
                <Modal onClose={() => setShowPinModal(false)}>
                <div className="flex flex-col items-center gap-6 text-center">
                    <h2 className="text-2xl font-bold">Enter 4-Digit PIN</h2>
                    <div className="flex gap-3">
                        {[0, 1, 2, 3].map((index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={pin[index]}
                                onChange={(e) => handlePinChange(index, e.target.value)}
                                className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-lg text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300"
                                onKeyDown={(e) => {
                                    if (e.key === "Backspace" && !e.target.value && index > 0) {
                                    document.getElementById(`pin-input-${index - 1}`).focus();
                                    }
                                }}
                                id={`pin-input-${index}`}
                            />
                        ))}
                    </div>
                    <button
                        disabled={!isPinComplete || isPinSubmitting}
                        onClick={async () => {
                            setIsPinSubmitting(true);
                            try {
                                await handleDatePayout(selectedDate, selectedData, pin.join(""));
                                setShowPinModal(false);
                                setPin(Array(4).fill(""));
                            } catch (err) {
                                console.error(err);
                            } finally {
                                setIsPinSubmitting(false);
                            }
                        }}
                        className="w-full py-3 bg-primary text-white rounded-lg disabled:opacity-50"
                    >
                    {isPinSubmitting ? "Verifying..." : "Confirm Withdrawal"}
                    </button>
                </div>
                </Modal>
            )}
        </div>
    )
};

export default ManageWithdrawals;