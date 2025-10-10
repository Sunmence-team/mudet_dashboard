import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Trash2 } from "lucide-react";

const PackageModal = ({ pkg, onClose, onSubmit, submitting, productsList }) => {
  const [selectedProducts, setSelectedProducts] = useState(pkg?.products || []);

  const formik = useFormik({
    initialValues: {
      packageName: pkg?.name || "",
      pointValue: pkg?.point_value || "",
      amount: pkg?.price || "",
      products: pkg?.products || [],
    },
    validationSchema: Yup.object({
      packageName: Yup.string().required("Required"),
      pointValue: Yup.number().required("Required"),
      amount: Yup.number().required("Required"),
      products: Yup.array()
        .min(1, "Select at least one product")
        .of(
          Yup.object().shape({
            name: Yup.string().required(),
            quantity: Yup.number().required(),
          })
        ),
    }),
    onSubmit: (values) => {
      // Only send name and quantity for each product
      const refined = values.products.map(({ name, quantity }) => ({
        name,
        quantity,
      }));
      onSubmit({
        ...values,
        products: refined,
      });
    },
  });

  // Add or update a product
  const handleAddProduct = (product) => {
    const exists = selectedProducts.find((p) => p.name === product.name);
    let updated;
    if (exists) {
      updated = selectedProducts.map((p) =>
        p.name === product.name ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      updated = [...selectedProducts, { ...product, quantity: 1 }];
    }
    setSelectedProducts(updated);
    formik.setFieldValue("products", updated);
  };

  // Decrease quantity
  const handleDecrease = (product) => {
    const updated = selectedProducts
      .map((p) =>
        p.name === product.name
          ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
          : p
      )
      .filter((p) => p.quantity > 0);
    setSelectedProducts(updated);
    formik.setFieldValue("products", updated);
  };

  // Delete product
  const handleDelete = (product) => {
    const updated = selectedProducts.filter((p) => p.name !== product.name);
    setSelectedProducts(updated);
    formik.setFieldValue("products", updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <p className="text-xl font-semibold mb-4">Manage Package</p>

          {/* PACKAGE NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Package Name{" "}
              {formik.touched.packageName && formik.errors.packageName && (
                <span className="text-red-500 text-xs">
                  - {formik.errors.packageName}
                </span>
              )}
            </label>
            <input
              type="text"
              name="packageName"
              value={formik.values.packageName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border rounded-lg w-full ${
                formik.touched.packageName && formik.errors.packageName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter Package name"
            />
          </div>

          {/* POINT VALUE */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Point Value{" "}
              {formik.touched.pointValue && formik.errors.pointValue && (
                <span className="text-red-500 text-xs">
                  - {formik.errors.pointValue}
                </span>
              )}
            </label>
            <input
              type="number"
              name="pointValue"
              value={formik.values.pointValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border rounded-lg w-full ${
                formik.touched.pointValue && formik.errors.pointValue
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter Package Point Value"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Amount{" "}
              {formik.touched.amount && formik.errors.amount && (
                <span className="text-red-500 text-xs">
                  - {formik.errors.amount}
                </span>
              )}
            </label>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border rounded-lg w-full ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter Package Amount"
            />
          </div>

          {/* PRODUCT SELECTION */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Products{" "}
              {formik.touched.products && formik.errors.products && (
                <span className="text-red-500 text-xs">
                  - {formik.errors.products}
                </span>
              )}
            </label>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              onChange={(e) => {
                const selected = productsList.find(
                  (p) => p.name === e.target.value
                );
                if (selected) handleAddProduct(selected);
              }}
            >
              <option value="">-- Choose Product --</option>
              {productsList?.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* SELECTED PRODUCTS */}
            <div className="mt-3 flex flex-col gap-2 max-h-25 styled-scrollbar overflow-auto">
              {selectedProducts?.map((p) => (
                <div
                  key={p.name}
                  className="flex justify-between items-center border p-2 rounded-md"
                >
                  <span>{p.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecrease(p)}
                      className="px-3 py-1 border rounded-md"
                    >
                      -
                    </button>
                    <span>{p.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleAddProduct(p)}
                      className="px-3 py-1 border rounded-md"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      className="px-1 py-1 text-red-500 border border-red-500 rounded-md"
                    >
                      <Trash2 size={23} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full w-full mt-4"
          >
            {submitting ? "Updating Package..." : "Update Package"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
