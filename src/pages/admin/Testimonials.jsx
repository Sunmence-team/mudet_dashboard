import React, { useEffect } from "react";
import { useFormik } from "formik";
import { ImagePlus } from "lucide-react";
import * as Yup from "yup";

const Testimonials = ({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
        rating: Yup.number().required("Rating is required").min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
        comment: Yup.string().required("Comment is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: formData.name || "",
            rating: formData.rating || "",
            comment: formData.comment || "",
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

    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
                    <p className="text-xl md:text-2xl font-semibold">Create Testimonial</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                                Name {formik.touched.name && formik.errors.name && <span className="text-red-500 text-xs"> - {formik.errors.name}</span>}
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`h-12 px-4 py-2 border w-full ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2">
                            <label htmlFor="rating" className="text-sm font-medium text-gray-700 mb-1">
                                Rating {formik.touched.rating && formik.errors.rating && <span className="text-red-500 text-xs"> - {formik.errors.rating}</span>}
                            </label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                value={formik.values.rating}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                min="1"
                                max="5"
                                className={`h-12 px-4 py-2 border w-full ${formik.touched.rating && formik.errors.rating ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-1">
                            Comment {formik.touched.comment && formik.errors.comment && <span className="text-red-500 text-xs"> - {formik.errors.comment}</span>}
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`h-24 px-4 py-2 border w-full ${formik.touched.comment && formik.errors.comment ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">
                            Image
                        </label>

                        {/* Upload container */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
                            {/* Icon at top */}
                            <ImagePlus size={40} className="mb-4" />

                            {/* Hidden file input */}
                            <input
                                type="file"
                                id="image"
                                name="image"
                                className="hidden"
                                onChange={(event) => {
                                    formik.setFieldValue("image", event.currentTarget.files[0]);
                                }}
                            />

                            {/* Button + text beside each other */}
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
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-full w-full sm:w-auto"
                    >
                        Create Testimonial
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Testimonials;