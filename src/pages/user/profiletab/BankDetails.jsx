import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import api from "../../../utilities/api";
import { useUser } from "../../../context/UserContext";

const BankDetails = () => {
  const { user } = useUser();
  const [banks, setBanks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Fetch all banks from Paystack
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("https://api.paystack.co/bank", {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          },
        });
        setBanks(response.data.data);
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast.error("Unable to fetch bank list. Please try again later.");
      }
    };
    fetchBanks();
  }, []);

  const validationSchema = Yup.object().shape({
    account_name: Yup.string()
      .required("Account name is required")
      .min(3, "Account name must be at least 3 characters"),
    account_number: Yup.string()
      .required("Account number is required")
      .matches(/^\d{10}$/, "Account number must be 10 digits"),
    bank_name: Yup.string().required("Please select your bank"),
  });

  const formik = useFormik({
    initialValues: {
      account_name: user.account_name || "",
      account_number: user.account_number || "",
      bank_name: user.bank_name || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await api.put("/api/updateBank", values);
        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            "An unexpected error occurred while updating bank details."
        );
      } finally {
        setSubmitting(false);
        resetForm();
      }
    },
  });

  // Auto resolve account name when account number and bank name are filled
  useEffect(() => {
    const resolveAccount = async () => {
      const { account_number, bank_name } = formik.values;

      if (account_number.length === 10 && bank_name) {
        setResolving(true);
        try {
          const response = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_name}`,
            {
              headers: {
                Authorization: `Bearer ${
                  import.meta.env.VITE_PAYSTACK_SECRET_KEY
                }`,
              },
            }
          );

          if (response.data.status) {
            formik.setFieldValue(
              "account_name",
              response.data.data.account_name
            );
            console.log("Account resolved successfully.");
          } else {
            console.error(
              "Unable to resolve account name. Please check details."
            );
          }
        } catch (error) {
          console.error(
            "Failed to resolve account name. Check bank and account number."
          );
        } finally {
          setResolving(false);
        }
      }
    };

    resolveAccount();
  }, [formik.values.account_number, formik.values.bank_name]);

  return (
    <form className="space-y-4 p-6" onSubmit={formik.handleSubmit}>
      <div>
        <label className="text-sm font-medium text-black/80 mb-2 flex items-center gap-1">
          Account Number
          {formik.touched.account_number && formik.errors.account_number && (
            <span className="text-red-500">
              - {formik.errors.account_number}
            </span>
          )}
        </label>
        <input
          type="text"
          name="account_number"
          placeholder="Enter account number"
          maxLength={10}
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.account_number && formik.errors.account_number
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.account_number}
        />
        {resolving && (
          <p className="text-xs text-gray-500 mt-1">
            Resolving account name...
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-black/80 mb-2 flex items-center gap-1">
          Select Bank
          {formik.touched.bank_name && formik.errors.bank_name && (
            <span className="text-red-500">- {formik.errors.bank_name}</span>
          )}
        </label>
        <select
          name="bank_name"
          className={`w-full border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.bank_name && formik.errors.bank_name
              ? "border-red-500"
              : "border-gray-300"
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.bank_name}
        >
          <option value="">Choose your bank</option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-black/80 mb-2 flex items-center gap-1">
          Account Name
          {formik.touched.account_name && formik.errors.account_name && (
            <span className="text-red-500">- {formik.errors.account_name}</span>
          )}
        </label>
        <input
          type="text"
          name="account_name"
          disabled
          placeholder="Account name will be auto-filled"
          className={`w-full cursor-not-allowed border rounded-lg px-4 py-2 focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${
            formik.touched.account_name && formik.errors.account_name
              ? "border-red-500"
              : "border-gray-300"
          }`}
          value={formik.values.account_name}
          onChange={formik.handleChange}
          readOnly
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] border-1 text-white text-sm font-medium py-4 px-5 rounded-4xl w-full"
      >
        {submitting ? "Saving Bank Details..." : "Save Bank Details"}
      </button>
    </form>
  );
};

export default BankDetails;
