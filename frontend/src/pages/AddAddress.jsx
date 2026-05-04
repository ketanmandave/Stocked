import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const InputField = ({ label, type, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm 
      focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
    />
  </div>
);

const AddAddress = () => {

  // Stores all address form values
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Controls loading state while fetching GPS
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { axios, user, navigate } = useAppContext();

  /* ===============================
     Handle Input Change
  ================================ */
  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ===============================
      Use Current Location (Geoapify)
  ================================ */
  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY; // 👈 Use environment variable

          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=en&apiKey=${GEOAPIFY_KEY}`
          );

          const data = await res.json();

          if (data.features && data.features.length > 0) {
            const addressInfo = data.features[0].properties;

            setAddress((prev) => ({
              ...prev,
              // Combines house number and street for a full "Street Address"
              street: addressInfo.housenumber
                ? `${addressInfo.housenumber} ${addressInfo.street || ""}`.trim()
                : addressInfo.street || addressInfo.name || "",

              city: addressInfo.city || addressInfo.village || addressInfo.suburb || "",
              state: addressInfo.state || "",
              zipcode: addressInfo.postcode || "",
              country: addressInfo.country_code?.toUpperCase() || "",
            }));
          } else {
            alert("No address found for this location.");
          }
        } catch (error) {
          console.error("Geoapify Error:", error);
          alert("Unable to fetch location details.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        alert("Location access denied. Please enable it in your settings.");
        setLoadingLocation(false);
      }
    );
  };

  /* ===============================
     Submit Handler
  ================================ */
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/address/add", {
        address
      });

      if (data.success) {
        toast.success("Address added");
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to add address");
    }
  };


  return (
    <div className="mt-16 pb-20 px-4 md:px-12 lg:px-20">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Add Shipping <span className="text-primary">Address</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in your delivery details below.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-14 items-center">

        {/* ================= FORM ================= */}
        <div className="flex-1 max-w-xl w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          <form onSubmit={onSubmitHandler} className="space-y-6">

            {/* Use Current Location Button */}
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={loadingLocation}
              className="w-full flex items-center justify-center gap-2 
              border border-primary text-primary rounded-xl py-3 font-medium 
              hover:bg-primary hover:text-white transition disabled:opacity-60"
            >
              <img
                src={assets.location}   // 🔥 Use proper icon from assets
                alt="location"
                className="w-7 h-7 rounded-2xl"
              />
              {loadingLocation ? "Detecting Location..." : "Use Current Location"}
            </button>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                value={address.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                value={address.lastName}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
            />

            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleChange}
            />

            <InputField
              label="Street Address"
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="City"
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
              />
              <InputField
                label="State"
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Zip Code"
                type="text"
                name="zipcode"
                value={address.zipcode}
                onChange={handleChange}
              />
              <InputField
                label="Country"
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-medium 
              hover:scale-[1.02] active:scale-95 transition"
            >
              Save Address
            </button>

          </form>
        </div>

        {/* ================= IMAGE ================= */}
        <div className="flex-1 flex justify-center">
          <img
            src={assets.add_address_iamge}
            alt="Add Address"
            className="max-w-sm w-full h-full mb-75 object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default AddAddress;
