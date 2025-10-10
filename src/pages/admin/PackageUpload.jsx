import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash } from "react-icons/fa"; // Using FaPlus for image upload icon
import api from "../../utilities/api";
import { toast } from "sonner";
import axios from "axios";
import PackageModal from "../../components/modals/PackageModal";
import Spinner from "../../components/Spinner";
import WarningModal from "../../components/modals/WarningModal";
import LazyLoader from "../../components/LazyLoader";
import CartCard from "../../components/cards/CartCard";

const PackageUpload = ({
  prevStep,
  nextStep,
  formData = {},
  updateFormData,
  setFormValidity,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activePackage, setActivePackage] = useState({});
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [updatingPackage, setUpdatingPackage] = useState(false);
  const [deletingPackage, setDeletingPackage] = useState(false);
  const [fetchingPackage, setFetchingPackage] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  // const [selectedProducts, setSelectedProducts] = useState([]);
  const fetchPackages = async () => {
    setFetchingPackage(true);
    try {
      const response = await api.get("/api/plans/all");
      console.log(response.data?.data?.data);
      setPackages(response.data?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingPackage(false);
    }
  };

  const fetchProducts = async () => {
    setFetchingProducts(true);
    try {
      const response = await api.get("/api/allproducts");
      console.log(response?.data);
      setProducts(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingProducts(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Package Name is required")
      .min(2, "Package Name must be at least 2 characters"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
    point_value: Yup.number()
      .required("Point Value is required")
      .min(0, "Point Value must be at least 0"),
    products: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required(),
          price: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      )
      .min(1, "Please select at least one product")
      .required("Please select at least one product")
      .test(
        "total-price-check",
        "The total cost of products cannot exceed the package price",
        function (products) {
          const { price } = this.parent;
          if (!price || !Array.isArray(products)) return true;
          const total = products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          );
          return total <= price;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: formData.name || "",
      price: formData.price || "",
      point_value: formData.point_value || "",
      products: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await api.post("/api/plans", {
          ...values,
          products: values.products.map(({ name, quantity }) => ({
            name,
            quantity,
          })),
        });
        console.log(response);
        if (response.status === 201) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
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
            "An unexpected error occurred while creating package. " +
              error?.response?.data?.message ||
              error?.message ||
              "Please try again later."
          );
          console.error("Error during creating package:", error);
        }
      } finally {
        setSubmitting(false);
        fetchPackages();
        resetForm();
      }
    },
  });

  const handleEditPackage = async (values) => {
    setUpdatingPackage(true);
    try {
      const response = await api.put(`/api/plans/${activePackage.id}`, {
        ...values,
        price: values.amount,
        point_value: values.pointValue,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setModalOpen(false);
      } else {
        toast.error(response.data.message);
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
          "An unexpected error occurred while updating package. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during updating package:", error);
      }
    } finally {
      setUpdatingPackage(false);
      fetchPackages();
    }
  };

  const handleDeletePackage = async () => {
    setDeletingPackage(true);
    try {
      const response = await api.delete(`/api/plans/${activePackage.id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setDeleteModalOpen(false);
      } else {
        toast.error(response.data.message);
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
          "An unexpected error occurred while deleting package. " +
            error?.response?.data?.message ||
            error?.message ||
            "Please try again later."
        );
        console.error("Error during deleting package:", error);
      }
    } finally {
      setDeletingPackage(false);
      fetchPackages();
    }
  };

  const increaseQuantity = (productName) => {
    const updated = formik.values.products.map((p) =>
      p.name === productName ? { ...p, quantity: p.quantity + 1 } : p
    );
    formik.setFieldValue("products", updated);
  };

  const decreaseQuantity = (productName) => {
    const updated = formik.values.products.map((p) =>
      p.name === productName && p.quantity > 1
        ? { ...p, quantity: p.quantity - 1 }
        : p
    );
    formik.setFieldValue("products", updated);
  };

  const removeProduct = (productName) => {
    const updated = formik.values.products.filter(
      (p) => p.name !== productName
    );
    formik.setFieldValue("products", updated);
  };

  useEffect(() => {
    if (setFormValidity) {
      setFormValidity(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, setFormValidity]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
            <p className="text-xl md:text-2xl font-semibold">Create Package</p>
            <div className="flex flex-col w-full">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Package Name{" "}
                {formik.touched.name && formik.errors.name && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.name}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Package name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="point_value"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Point Value{" "}
                {formik.touched.point_value && formik.errors.point_value && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.point_value}
                  </span>
                )}
              </label>
              <input
                type="number"
                id="point_value"
                name="point_value"
                placeholder="Enter Package Point Value"
                value={formik.values.point_value}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.point_value && formik.errors.point_value
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="price"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Price{" "}
                {formik.touched.price && formik.errors.price && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.price}
                  </span>
                )}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Enter Package price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="products"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Products{" "}
                {formik.touched.products && formik.errors.products && (
                  <span className="text-red-500 text-xs">
                    {" "}
                    - {formik.errors.products}
                  </span>
                )}
              </label>
              <select
                id="products"
                name="products"
                onChange={(e) => {
                  const selectedProduct = JSON.parse(e.target.value);
                  const existingProducts = formik.values.products;

                  const alreadySelected = existingProducts.some(
                    (p) => p.name === selectedProduct.name
                  );

                  const updatedProducts = alreadySelected
                    ? existingProducts.filter(
                        (p) => p.name !== selectedProduct.name
                      )
                    : [...existingProducts, selectedProduct];

                  formik.setFieldValue("products", updatedProducts);
                }}
                onBlur={formik.handleBlur}
                value=""
                className={`h-12 px-4 py-2 border w-full ${
                  formik.touched.products && formik.errors.products
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="" disabled>
                  {fetchingProducts
                    ? "Fetching Products..."
                    : "Select product(s)"}
                </option>
                {products.map((prd, index) => (
                  <option
                    key={index}
                    value={JSON.stringify({
                      name: prd.product_name,
                      quantity: 1,
                      price: prd.price,
                    })}
                  >
                    {prd.product_name} (₦{prd.price})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid lg:grid-cols-2 gap-3">
              {formik.values.products.length > 0 &&
                formik.values.products.map((el, index) => {
                  const displayedProduct = products.find((product) => {
                    return product.product_name === el.name;
                  });
                  return (
                    <CartCard
                      product={{ ...displayedProduct, quantity: el.quantity }}
                      key={index}
                      onAddToCart={() =>
                        increaseQuantity(displayedProduct.product_name)
                      }
                      onRemoveFromCart={() =>
                        decreaseQuantity(displayedProduct.product_name)
                      }
                      onDelete={() =>
                        removeProduct(displayedProduct.product_name)
                      }
                    />
                  );
                })}
            </div>
            {formik.values.products.length > 0 && (
              <p
                className={`text-sm ${
                  formik.values.products.reduce(
                    (sum, p) => sum + p.price * p.quantity,
                    0
                  ) > formik.values.price
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                Total Products Value: ₦
                {formik.values.products
                  .reduce((sum, p) => sum + p.price * p.quantity, 0)
                  .toLocaleString()}
              </p>
            )}
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
            >
              {submitting ? "Uploading Package..." : "Upload Package"}
            </button>
          </div>
        </form>
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 lg:p-8 p-5 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">Packages</p>
          <div className="w-full">
            {fetchingPackage ? (
              <LazyLoader />
            ) : packages.length === 0 ? (
              <div className="w-full flex items-center justify-center py-12">
                <div className="text-gray-500 text-lg font-medium">
                  Seems there are no packages or we couldn't fetch them.
                </div>
              </div>
            ) : (
              <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                {packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="relative group w-[270px] md:w-[280px] border border-black/10 flex flex-col rounded-2xl overflow-hidden lg:mx-0 mx-auto"
                    onMouseOver={() => setActivePackage(pkg)}
                  >
                    <div
                      className={`h-18 ${
                        index % 2 === 0 ? "bg-primary" : "bg-secondary"
                      } rounded-t-2xl flex items-center justify-center text-white text-center capitalize`}
                    >
                      <p className="text-xl md:text-2xl font-bold">
                        {pkg.name}{" "}
                        {pkg.name.includes("package") ? "" : "package"}
                      </p>
                    </div>

                    <div className="py-6 flex flex-col gap-4 items-center justify-center group-hover:blur-sm transition duration-300">
                      <p className="text-3xl md:text-4xl font-bold">
                        {pkg.price.toLocaleString()}
                        <span className="text-sm font-light text-black/50">
                          {" "}
                          NGN
                        </span>
                      </p>
                      <p className="text-black/70 text-[12px]">
                        Point Value: {pkg.point_value}PV
                      </p>
                    </div>

                    <div className="absolute inset-0 hidden md:flex sm:hidden items-end justify-center pb-9 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <div className="flex gap-4">
                        <button
                          className="flex gap-1 items-center cursor-pointer px-4 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition"
                          onClick={() => setModalOpen(true)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="flex gap-1 items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex md:hidden items-center w-full justify-between gap-3 p-4 border-t border-black/10 bg-white">
                      <button
                        className="flex gap-1 items-center cursor-pointer px-3 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary transition text-sm"
                        onClick={() => setModalOpen(true)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="flex gap-1 items-center cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        onClick={() => setDeleteModalOpen(true)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <PackageModal
          pkg={activePackage}
          onClose={() => setModalOpen(false)}
          onSubmit={handleEditPackage}
          submitting={updatingPackage}
        />
      ) : null}
      {isDeleteModalOpen ? (
        <WarningModal
          title={"Are you sure you want to delete this package?"}
          message={`Clicking the confirm button will delete ${
            activePackage.name ? `the ${activePackage.name}` : "this package"
          } permanently.`}
          negativeAction={() => setDeleteModalOpen(false)}
          positiveAction={handleDeletePackage}
          isPositive={deletingPackage}
        />
      ) : null}
    </>
  );
};

export default PackageUpload;
