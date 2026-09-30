import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./UserLogin.css";
import userLoginBg from "../assets/user-login-bg.png";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function UserLogin() {

    const navigate = useNavigate();


    // ================= STATES =================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    // ================= LOGIN =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);


        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.USER.LOGIN,
                {
                    email: email,
                    password: password
                }
            );


            console.log("Login Response:", response.data);


            if (response.data.success) {

                // Remember that user is logged in
                localStorage.setItem(
                    "userLoggedIn",
                    "true"
                );


                // Save user ID for cart functionality
                // Backend returns "_id"
                if (response.data.user?._id) {

                    localStorage.setItem(
                        "userId",
                        response.data.user._id
                    );

                    console.log(
                        "Logged In User ID:",
                        response.data.user._id
                    );

                }


                toast.success(
                    "Login successful!"
                );


                navigate("/");

            }

        } catch (error) {

            console.log(
                "Login Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Login failed";


            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="user-login-page"
            style={{ backgroundImage: `url(${userLoginBg})` }}
        >

            <div className="user-login-card">

                <h1>
                    <span>User</span> Login
                </h1>


                <form onSubmit={handleSubmit}>


                    {/* Email */}

                    <div className="user-input-group">

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

                    <div className="user-input-group">

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
                        className="user-login-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <span className="loading-spinner"></span>

                        ) : (

                            "Login"

                        )}

                    </button>


                    {/* Create Account */}

                    <p className="create-account-text">

                        Don't have an account?

                        <span
                            className="create-account-link"
                            onClick={() =>
                                navigate("/user/signup")
                            }
                        >
                            Create Account
                        </span>

                    </p>

                </form>

            </div>

        </div>
    );
}

export default UserLogin;