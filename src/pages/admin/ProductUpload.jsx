import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiUploadSimple } from "react-icons/pi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../utilities/api";
import { toast } from "sonner";

const ProductUpload = ({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }) => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState({
    submit: false,
    view: false,
    edit: false,
    delete: false,
    fetch: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      const response = await api.get("/api/allproducts");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string()
      .required("Product Name is required")
      .min(2, "Product Name must be at least 2 characters"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
    pointValue: Yup.number()
      .required("Point Value is required")
      .min(0, "Point Value must be at least 0"),
    inStock: Yup.number()
      .required("In Stock is required")
      .min(0, "In Stock must be at least 0"),
    description: Yup.string().required("Description is required"),
    repurchase: Yup.number()
      .required("Repurchase is required")
      .min(0, "Repurchase must be at least 0"),
  });

  const formik = useFormik({
    initialValues: {
      productName: formData.productName || "",
      price: formData.price || "",
      pointValue: formData.pointValue || "",
      inStock: formData.inStock || "",
      description: formData.description || "",
      repurchase: formData.repurchase || "",
      image: formData.image || null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading((prev) => ({ ...prev, submit: true }));
      const formDataToSend = new FormData();
      formDataToSend.append("product_name", values.productName);
      formDataToSend.append("product_description", values.description);
      formDataToSend.append("product_pv", values.pointValue);
      formDataToSend.append("price", values.price);
      formDataToSend.append("in_stock", values.inStock);
      formDataToSend.append("repurchase", values.repurchase);
      if (values.image) {
        formDataToSend.append("product_image", values.image);
      }

      try {
        let response;
        if (isEditing) {
          response = await api.post(`/api/updateproduct/${editingProductId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await api.post("/api/products", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        if (response.status === 200 || response.status === 201) {
          toast.success(isEditing ? "Product updated successfully" : "Product created successfully");
          fetchProducts();
          setIsEditing(false);
          setEditingProductId(null);
          resetForm();
          if (!isEditing && typeof updateFormData === "function") {
            updateFormData(values);
            nextStep();
          }
        }
      } catch (err) {
        console.error("Error during product operation:", err);
        if (err.response && err.response.data && err.response.data.errors) {
          console.log("Validation errors:", err.response.data.errors);
          const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
          toast.error(errorMessages || "Validation error occurred. Please check your inputs.");
        } else {
          toast.error(err?.response?.data?.message || "An error occurred. Please try again.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, submit: false }));
      }
    },
  });

  useEffect(() => {
    if (setFormValidity) {
      setFormValidity(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, setFormValidity]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden"; // lock <html> too
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedProduct]);



  const handleEdit = (product) => {
    setLoading((prev) => ({ ...prev, edit: true }));
    setIsEditing(true);
    setEditingProductId(product.id);
    formik.setValues({
      productName: product.product_name,
      price: product.price,
      pointValue: product.product_pv,
      inStock: product.in_stock,
      description: product.product_description,
      repurchase: product.repurchase || "",
      image: null,
    });
    setLoading((prev) => ({ ...prev, edit: false }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading((prev) => ({ ...prev, delete: true }));
      try {
        const response = await api.delete(`/api/deleteproducts/${id}`);
        if (response.status === 200) {
          toast.success("Product deleted successfully");
          fetchProducts();
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        toast.error(err?.response?.data?.message || "Failed to delete product.");
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    }
  };

  const handleView = async (id) => {
    setLoading((prev) => ({ ...prev, view: true }));
    try {
      const response = await api.get(`/api/eachproduct/${id}`);
      console.log("View response:", response.data); // Debug log
      setSelectedProduct(response.data); // Changed to response.data assuming flat structure
    } catch (err) {
      console.error("Error fetching product details:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch product details.");
    } finally {
      setLoading((prev) => ({ ...prev, view: false }));
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl font-semibold">Manage Products</p>
          {/* Product Name - Full Width */}
          <div className="flex flex-col w-full">
            <label htmlFor="productName" className="text-sm font-medium text-gray-700 mb-1">
              Product Name{" "}
              {formik.touched.productName && formik.errors.productName && (
                <span className="text-red-500 text-xs"> - {formik.errors.productName}</span>
              )}
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formik.values.productName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`h-12 px-4 py-2 border w-full ${formik.touched.productName && formik.errors.productName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
            />
          </div>
          {/* Other Fields - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1">
                Price{" "}
                {formik.touched.price && formik.errors.price && (
                  <span className="text-red-500 text-xs"> - {formik.errors.price}</span>
                )}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.price && formik.errors.price ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="pointValue" className="text-sm font-medium text-gray-700 mb-1">
                Point Value{" "}
                {formik.touched.pointValue && formik.errors.pointValue && (
                  <span className="text-red-500 text-xs"> - {formik.errors.pointValue}</span>
                )}
              </label>
              <input
                type="number"
                id="pointValue"
                name="pointValue"
                value={formik.values.pointValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.pointValue && formik.errors.pointValue ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="inStock" className="text-sm font-medium text-gray-700 mb-1">
                In Stock{" "}
                {formik.touched.inStock && formik.errors.inStock && (
                  <span className="text-red-500 text-xs"> - {formik.errors.inStock}</span>
                )}
              </label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                value={formik.values.inStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.inStock && formik.errors.inStock ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="repurchase" className="text-sm font-medium text-gray-700 mb-1">
                Repurchase{" "}
                {formik.touched.repurchase && formik.errors.repurchase && (
                  <span className="text-red-500 text-xs"> - {formik.errors.repurchase}</span>
                )}
              </label>
              <input
                type="number"
                id="repurchase"
                name="repurchase"
                value={formik.values.repurchase}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.repurchase && formik.errors.repurchase ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                {formik.touched.description && formik.errors.description && (
                  <span className="text-red-500 text-xs"> - {formik.errors.description}</span>
                )}
              </label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-36 px-4 py-2 border w-full ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 h-36">
                <PiUploadSimple size={30} className="mb-4" />
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*" // Added to restrict to images only
                  className="hidden"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                />
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="image"
                    className="px-6 text-xs py-2 bg-pryClr text-black border border-black/50 rounded-lg cursor-pointer hover:bg-pryClr/90"
                  >
                    Choose File
                  </label>
                  {formik.values.image ? (
                    <span className="text-sm text-gray-700">{formik.values.image.name}</span>
                  ) : (
                    <span className="text-sm text-gray-500">No file chosen</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading.submit}
            className="bg-primary text-white px-6 py-2 rounded-full w-full flex items-center justify-center"
          >
            {loading.submit ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Upload Product"
            )}
          </button>
        </div>
      </form>
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-4 text-center p-4 rounded-lg bg-gray-100 min-w-[700px]">
            <span>IMAGE</span>
            <span>NAME</span>
            <span>PRICE</span>
            <span>POINT VALUE</span>
            <span>STOCK</span>
            <span>REPURCHASE</span>
            <span>ACTION</span>
          </div>
          {loading.fetch ? (
            <div className="flex justify-center p-4">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No products available.</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-7 gap-4 text-center p-4 bg-white min-w-[700px]"
              >
                <div className="flex justify-center">
                  {product.product_image ? (
                    <img src={product.product_image} alt="Product" className="w-16 h-16 object-cover" />
                  ) : (
                    <div className="bg-gray-100 w-16 h-16"></div>
                  )}
                </div>
                <span>{product.product_name}</span>
                <span>{product.price}</span>
                <span>{product.product_pv}</span>
                <span>{product.in_stock}</span>
                <span>{product.repurchase || "N/A"}</span>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleView(product.id)}
                    disabled={loading.view}
                    className="text-primary cursor-pointer disabled:opacity-50"
                    title="View"
                  >
                    {loading.view && selectedProduct?.id === product.id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaEye />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    disabled={loading.edit}
                    className="text-primary cursor-pointer disabled:opacity-50"
                    title="Edit"
                  >
                    {loading.edit && editingProductId === product.id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaEdit />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={loading.delete}
                    className="text-primary cursor-pointer disabled:opacity-50"
                    title="Delete"
                  >
                    {loading.delete && product.id === product.id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full 
                    max-h-[90vh] overflow-y-auto transform transition-all scale-100">

            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-white">
              <h2 className="text-lg sm:text-xl font-bold">Product Details</h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {selectedProduct.product_image && (
                <div className="flex justify-center">
                  <img
                    src={selectedProduct.product_image}
                    alt={selectedProduct.product_name}
                    className="w-40 h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
                <div>
                  <p className="font-semibold text-gray-700">Name</p>
                  <p className="text-gray-600">{selectedProduct.product_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Price</p>
                  <p className="text-gray-600">₦{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Point Value</p>
                  <p className="text-gray-600">{selectedProduct.product_pv}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">In Stock</p>
                  <p className="text-gray-600">{selectedProduct.in_stock}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Repurchase</p>
                  <p className="text-gray-600">{selectedProduct.repurchase || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700">Description</p>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {selectedProduct.product_description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full shadow-md transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProductUpload;