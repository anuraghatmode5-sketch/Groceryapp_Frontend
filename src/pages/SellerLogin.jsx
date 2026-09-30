import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./SellerLogin.css";
import sellerLoginBg from "../assets/seller-login-bg.png";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function SellerLogin() {

    const navigate = useNavigate();


    // ================= STATES =================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    // ================= SELLER LOGIN =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);


        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.SELLER.LOGIN,
                {
                    email: email,
                    password: password
                }
            );


            console.log("Seller Login Response:", response.data);


            if (response.data.success) {

                toast.success("Seller login successful!");

                // Navigate to seller dashboard
                navigate("/sellerdashboard");

            }

        } catch (error) {

            console.log("Seller Login Error:", error);


            const message =
                error.response?.data?.message ||
                "Seller login failed";


            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="seller-login-page"
            style={{ backgroundImage: `url(${sellerLoginBg})` }}
        >

            <div className="seller-login-card">

                <h1>
                    <span>Seller</span> Login
                </h1>


                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="seller-input-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>


                    {/* Password */}
                    <div className="seller-input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="seller-login-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <span className="loading-spinner"></span>

                        ) : (

                            "Login"

                        )}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default SellerLogin;