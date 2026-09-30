import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./AddAddress.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";
import Navbar from "../components/Navbar.jsx";


function AddAddress() {

    const navigate = useNavigate();


    // ================= FORM STATE =================

    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""

    });


    const [loading, setLoading] = useState(false);


    // ================= HANDLE INPUT =================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ================= SAVE ADDRESS =================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (loading) {
            return;
        }


        // ================= BASIC VALIDATION =================

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.street.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.zipcode.trim() ||
            !formData.country.trim() ||
            !formData.phone.trim()
        ) {

            toast.error("Please fill all address fields");

            return;

        }


        try {

            setLoading(true);


            // ================= ADD ADDRESS API =================

            const response = await axiosInstance.post(

                API_ENDPOINTS.ADDRESS.ADD,

                {
                    address: {

                        firstName: formData.firstName,

                        lastName: formData.lastName,

                        email: formData.email,

                        street: formData.street,

                        city: formData.city,

                        state: formData.state,

                        zipcode: Number(formData.zipcode),

                        country: formData.country,

                        phone: formData.phone

                    }
                }

            );


            console.log(
                "Add Address Response:",
                response.data
            );


            // ================= SUCCESS =================

            if (response.data.success) {

                toast.success(
                    response.data.message ||
                    "Address added successfully"
                );


                navigate("/cart");

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to add address"
                );

            }


        } catch (error) {

            console.log(
                "Add Address Error:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                "Failed to add address"

            );


        } finally {

            setLoading(false);

        }

    };


    return (
        <>
        <Navbar/>

        <div className="add-address-page">

            <div className="add-address-container">

                {/* ================= LEFT SECTION ================= */}

                <div className="add-address-left">

                    <h1>
                        Add Shipping <span>Address</span>
                    </h1>


                    <form
                        className="address-form"
                        onSubmit={handleSubmit}
                    >

                        {/* First Name + Last Name */}

                        <div className="address-row">

                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Email */}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />


                        {/* Street */}

                        <input
                            type="text"
                            name="street"
                            placeholder="Street"
                            value={formData.street}
                            onChange={handleChange}
                        />


                        {/* City + State */}

                        <div className="address-row">

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Zip + Country */}

                        <div className="address-row">

                            <input
                                type="text"
                                name="zipcode"
                                placeholder="Zip code"
                                value={formData.zipcode}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                            />

                        </div>


                        {/* Phone */}

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />


                        {/* Save */}

                        <button
                            type="submit"
                            className="save-address-button"
                            disabled={loading}
                        >

                            {loading
                                ? "SAVING..."
                                : "SAVE ADDRESS"
                            }

                        </button>

                    </form>

                </div>


                {/* ================= RIGHT SECTION ================= */}

                <div className="add-address-right">

                    <div className="address-illustration">

                        📍

                    </div>

                </div>

            </div>

        </div>

        </>

    );

}

export default AddAddress;