// utilities/paystackHelper.js
import axios from "axios";

const PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

/**
 * Fetch supported banks from Paystack
 */
export const fetchPaystackBanks = async () => {
  try {
    const response = await axios.get("https://api.paystack.co/bank", {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.status && Array.isArray(response.data.data)) {
      return response.data.data; // array of banks
    } else {
      throw new Error("Failed to fetch Paystack banks");
    }
  } catch (error) {
    console.error("Error fetching Paystack banks:", error);
    return [];
  }
};

/**
 * Get bank code by name
 * @param {string} bankName - e.g. "Access Bank"
 * @param {Array} banks - array of banks from Paystack
 */
export const getBankCode = (bankName, banks) => {
  if (!banks || banks.length === 0) return "";
  const match = banks.find(
    (bank) => bank.name.toLowerCase() === bankName?.toLowerCase()
  );
  return match ? match.code : "";
};
