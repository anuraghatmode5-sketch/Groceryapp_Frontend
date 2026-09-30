import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./SellerNavbar.css";
import logo from "../assets/logo.png";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function SellerNavbar() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    // ================= SELLER LOGOUT =================

    const handleLogout = async () => {

        if (loading) {
            return;
        }

        setLoading(true);

        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.SELLER.LOGOUT
            );

            console.log(
                "Seller Logout Response:",
                response.data
            );


            if (response.data.success) {

                toast.success("Logged out successfully!");

                navigate("/seller");

            } else {

                toast.error(
                    response.data.message ||
                    "Logout failed"
                );

            }

        } catch (error) {

            console.log(
                "Seller Logout Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <nav className="seller-navbar">


            {/* Logo */}

            <div className="seller-navbar-logo">

                <img
                    src={logo}
                    alt="GrocerWiseQ"
                />

                <span>
                    GrocerWiseQ
                </span>

            </div>


            {/* Right Side */}

            <div className="seller-navbar-right">

                <span className="seller-admin-text">
                    Hi! Admin
                </span>


                <button
                    className="seller-logout-button"
                    onClick={handleLogout}
                    disabled={loading}
                >

                    {loading ? (

                        <span className="loading-spinner"></span>

                    ) : (

                        "Logout"

                    )}

                </button>

            </div>


        </nav>
    );
}

export default SellerNavbar;