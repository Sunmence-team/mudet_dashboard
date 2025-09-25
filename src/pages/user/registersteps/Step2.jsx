import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";

const Step2 = ({ prevStep, nextStep, formData = {}, updateFormData, setFormValidity }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ countries: false, states: false, cities: false });
  const [error, setError] = useState(null);
  const [countryCodeMap, setCountryCodeMap] = useState({});

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    date_of_birth: Yup.string().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("Local Government Area is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .test("valid-phone", "Must be a valid phone number for the selected country", function (value) {
        const { country } = this.parent;
        if (!country || !value) return false;
        const isoCode = countryCodeMap[country];
        return isoCode ? isValidPhoneNumber(value, isoCode) : false;
      }),
    email: Yup.string().email("Must be a valid email address").required("Email is required"),
    stockist: Yup.string().required("Stockist is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: formData.first_name || "",
      last_name: formData.last_name || "",
      date_of_birth: formData.date_of_birth || "",
      gender: formData.gender || "",
      country: formData.country || "",
      state: formData.state || "",
      city: formData.city || "",
      mobile: formData.mobile || "",
      email: formData.email || "",
      stockist: formData.stockist || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData(values);
      nextStep();
    },
  });

  useEffect(() => {
    setFormValidity(formik.isValid && formik.dirty);
  }, [formik.isValid, formik.dirty, setFormValidity]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      setError(null);
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries");
        const result = await response.json();
        if (result.error) throw new Error(result.msg);

        const countryMap = {};
        const countryList = result.data.map((c) => ({ name: c.country, isoCode: c.iso2 })).sort((a, b) => a.name.localeCompare(b.name));
        countryList.forEach((c) => (countryMap[c.name] = c.isoCode));

        setCountries(countryList.map((c) => c.name));
        setCountryCodeMap(countryMap);
      } catch (err) {
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (formik.values.country) {
      const fetchStates = async () => {
        setLoading((prev) => ({ ...prev, states: true }));
        setError(null);
        try {
          const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: formik.values.country }),
          });
          const result = await response.json();
          if (result.error) throw new Error(result.msg);

          const stateList = result.data?.states?.map((s) => s.name) || [];
          setStates(stateList);
          setCities([]);
          formik.setFieldValue("state", "");
          formik.setFieldValue("city", "");
        } catch (err) {
          setError("Failed to load states for selected country.");
          setStates([]);
          setCities([]);
          formik.setFieldValue("state", "");
          formik.setFieldValue("city", "");
        } finally {
          setLoading((prev) => ({ ...prev, states: false }));
        }
      };
      fetchStates();
    } else {
      setStates([]);
      setCities([]);
      formik.setFieldValue("state", "");
      formik.setFieldValue("city", "");
    }
  }, [formik.values.country]);

  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      const fetchCities = async () => {
        setLoading((prev) => ({ ...prev, cities: true }));
        setError(null);
        try {
          const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: formik.values.country, state: formik.values.state }),
          });
          const result = await response.json();
          if (result.error) throw new Error(result.msg);

          setCities(result.data || []);
          formik.setFieldValue("city", "");
        } catch (err) {
          setError("Failed to load local government areas for selected state.");
          setCities([]);
          formik.setFieldValue("city", "");
        } finally {
          setLoading((prev) => ({ ...prev, cities: false }));
        }
      };
      fetchCities();
    } else {
      setCities([]);
      formik.setFieldValue("city", "");
    }
  }, [formik.values.state, formik.values.country]);

  const getMobilePlaceholder = () => {
    const country = formik.values.country;
    if (!country || !countryCodeMap[country]) return "Enter phone number";
    return `+${getCountryCallingCode(countryCodeMap[country])}XXXXXXXXXX`;
  };

  const stockists = [{ id: "1", username: "Stockist A", stockist_location: "Location A" }, { id: "2", username: "Stockist B", stockist_location: "Location B" }];

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="bg-white border border-black/10 w-full flex flex-col gap-6 p-4 md:p-8 rounded-lg">
          <p className="text-xl md:text-2xl font-semibold">Contact Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1">
                First Name {formik.touched.first_name && formik.errors.first_name && <span className="text-red-500 text-xs"> - {formik.errors.first_name}</span>}
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.first_name && formik.errors.first_name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1">
                Last Name {formik.touched.last_name && formik.errors.last_name && <span className="text-red-500 text-xs"> - {formik.errors.last_name}</span>}
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.last_name && formik.errors.last_name ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700 mb-1">
                Date of Birth (YYYY-MM-DD) {formik.touched.date_of_birth && formik.errors.date_of_birth && <span className="text-red-500 text-xs"> - {formik.errors.date_of_birth}</span>}
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 w-full px-4 py-2 border ${formik.touched.date_of_birth && formik.errors.date_of_birth ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1">
                Gender {formik.touched.gender && formik.errors.gender && <span className="text-red-500 text-xs"> - {formik.errors.gender}</span>}
              </label>
              <select
                id="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.gender && formik.errors.gender ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="text-sm font-medium text-gray-700 mb-1">
                Country {formik.touched.country && formik.errors.country && <span className="text-red-500 text-xs"> - {formik.errors.country}</span>}
              </label>
              <select
                id="country"
                name="country"
                value={formik.values.country}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("state", "");
                  formik.setFieldValue("city", "");
                  formik.setFieldValue("mobile", "");
                }}
                onBlur={formik.handleBlur}
                disabled={loading.countries}
                className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.country && formik.errors.country ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="">{loading.countries ? "Loading countries..." : "Select Country"}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-1">
                State {formik.touched.state && formik.errors.state && <span className="text-red-500 text-xs"> - {formik.errors.state}</span>}
              </label>
              <select
                id="state"
                name="state"
                value={formik.values.state}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("city", "");
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.country || loading.states}
                className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.state && formik.errors.state ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="">
                  {loading.states
                    ? "Loading states..."
                    : !formik.values.country
                    ? "Select country first"
                    : states.length === 0
                    ? "No states available"
                    : "Select State"}
                </option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1">
                Local Government Area {formik.touched.city && formik.errors.city && <span className="text-red-500 text-xs"> - {formik.errors.city}</span>}
              </label>
              <select
                id="city"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.state || loading.cities}
                className={`h-12 px-4 py-2 border disabled:opacity-50 disabled:cursor-not-allowed ${formik.touched.city && formik.errors.city ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="">
                  {loading.cities
                    ? "Loading LGAs..."
                    : !formik.values.state
                    ? "Select state first"
                    : cities.length === 0
                    ? "No LGAs available"
                    : "Select LGA"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="mobile" className="text-sm font-medium text-gray-700 mb-1">
                Mobile Number {formik.touched.mobile && formik.errors.mobile && <span className="text-red-500 text-xs"> - {formik.errors.mobile}</span>}
              </label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={getMobilePlaceholder()}
                className={`h-12 px-4 py-2 border ${formik.touched.mobile && formik.errors.mobile ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                Email {formik.touched.email && formik.errors.email && <span className="text-red-500 text-xs"> - {formik.errors.email}</span>}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className={`h-12 px-4 py-2 border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="stockist" className="text-sm font-medium text-gray-700 mb-1">
                Stockist {formik.touched.stockist && formik.errors.stockist && <span className="text-red-500 text-xs"> - {formik.errors.stockist}</span>}
              </label>
              <select
                id="stockist"
                name="stockist"
                value={formik.values.stockist}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`h-12 px-4 py-2 border ${formik.touched.stockist && formik.errors.stockist ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-pryClr focus:border-pryClr`}
              >
                <option value="" disabled>Select Stockist</option>
                {stockists.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.username} ({item.stockist_location})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Step2;