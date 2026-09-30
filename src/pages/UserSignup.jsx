import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./UserSignup.css";
import userSignupBg from "../assets/user-login-bg.png";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function UserSignup() {

    const navigate = useNavigate();


    // ================= STATES =================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    // ================= SIGNUP =================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // Start loading

        setLoading(true);


        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.USER.REGISTER,
                {
                    name: name,
                    email: email,
                    password: password
                }
            );


            console.log("Signup Response:", response.data);


            if (response.data.success) {

                // Success toast

                toast.success("Account created successfully!");


                // Navigate to Home

                navigate("/");

            }

        } catch (error) {

            console.log("Signup Error:", error);


            // Get backend error message if available

            const message =
                error.response?.data?.message ||
                "Failed to create account";


            // Error toast

            toast.error(message);

        } finally {

            // Stop loading

            setLoading(false);

        }

    };


    return (

        <div
            className="user-signup-page"
            style={{ backgroundImage: `url(${userSignupBg})` }}
        >

            <div className="user-signup-card">

                <h1>
                    <span>User</span> Sign Up
                </h1>


                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="user-signup-input-group">

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />

                    </div>


                    {/* Email */}
                    <div className="user-signup-input-group">

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
                    <div className="user-signup-input-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Type here"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />

                    </div>


                    {/* Already have account */}
                    <p className="already-account-text">

                        Already have account?

                        <span
                            className="login-link"
                            onClick={() => navigate("/user")}
                        >
                            click here
                        </span>

                    </p>


                    {/* Create Account Button */}
                    <button
                        type="submit"
                        className="create-account-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <span className="loading-spinner"></span>

                        ) : (

                            "Create Account"

                        )}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default UserSignup;