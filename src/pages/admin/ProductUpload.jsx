import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PiUploadSimple } from "react-icons/pi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Using FaPlus for image upload icon

const ProductUpload = ({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product Name is required").min(2, "Product Name must be at least 2 characters"),
    price: Yup.number().required("Price is required").min(0, "Price must be at least 0"),
    pointValue: Yup.number().required("Point Value is required").min(0, "Point Value must be at least 0"),
    inStock: Yup.number().required("In Stock is required").min(0, "In Stock must be at least 0"),
    description: Yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      productName: formData.productName || "",
      price: formData.price || "",
      pointValue: formData.pointValue || "",
      inStock: formData.inStock || "",
      description: formData.description || "",
      image: formData.image || null,
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData(values);
      nextStep();
    },
  });

  useEffect(() => {
    if (setFormValidity) {
      setFormValidity(formik.isValid && formik.dirty);
    }
  }, [formik.isValid, formik.dirty, setFormValidity]);

  // Sample array for products
  const products = [
    { id: 1, name: "Cinnamon Herbal Extract", price: 14000, pointValue: 12, stock: 62 },
    { id: 2, name: "Lavender Essential Oil", price: 12000, pointValue: 10, stock: 45 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">Manage Products</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="productName" className="text-sm font-medium text-gray-700 mb-1">
                Product Name {formik.touched.productName && formik.errors.productName && <span className="text-red-500 text-xs"> - {formik.errors.productName}</span>}
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.productName && formik.errors.productName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1">
                Price {formik.touched.price && formik.errors.price && <span className="text-red-500 text-xs"> - {formik.errors.price}</span>}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.price && formik.errors.price ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="pointValue" className="text-sm font-medium text-gray-700 mb-1">
                Point Value {formik.touched.pointValue && formik.errors.pointValue && <span className="text-red-500 text-xs"> - {formik.errors.pointValue}</span>}
              </label>
              <input
                type="number"
                id="pointValue"
                name="pointValue"
                value={formik.values.pointValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.pointValue && formik.errors.pointValue ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="inStock" className="text-sm font-medium text-gray-700 mb-1">
                In Stock {formik.touched.inStock && formik.errors.inStock && <span className="text-red-500 text-xs"> - {formik.errors.inStock}</span>}
              </label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                value={formik.values.inStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border w-full ${formik.touched.inStock && formik.errors.inStock ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
                Description {formik.touched.description && formik.errors.description && <span className="text-red-500 text-xs"> - {formik.errors.description}</span>}
              </label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-36 px-4 py-2 border w-full ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 h-36">
                <PiUploadSimple size={30} className="mb-4" />
                <input
                  type="file"
                  id="image"
                  name="image"
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
            className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
          >
            Upload Product
          </button>
        </div>
      </form>
  <div className="w-full mt-6">
  <h2 className="text-xl font-semibold mb-4">All Products</h2>

  {/* Scrollable wrapper */}
  <div className="overflow-x-auto">
    {/* Header row */}
    <div className="grid grid-cols-6 gap-4 text-center p-4 rounded-lg min-w-[700px]">
      <span>IMAGE</span>
      <span>NAME</span>
      <span>PRICE</span>
      <span>POINT VALUE</span>
      <span>STOCK</span>
      <span>ACTION</span>
    </div>

    {/* Products */}
    {products.map((product) => (
      <div
        key={product.id}
        className="grid grid-cols-6 gap-4 text-center p-4 bg-white min-w-[700px]"
      >
        <div className="bg-gray-100 w-16 h-16"></div>
        <span>{product.name}</span>
        <span>{product.price}</span>
        <span>{product.pointValue}</span>
        <span>{product.stock}</span>
        <div className="flex justify-center gap-2">
          <FaEdit className="text-primary cursor-pointer" />
          <FaTrash className="text-primary cursor-pointer" />
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default ProductUpload;