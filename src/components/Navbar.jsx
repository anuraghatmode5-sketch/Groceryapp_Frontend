import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import logo from "../assets/logo.png";
import "./Navbar.css";

import {
    ShoppingCart,
    User,
    Menu
} from "lucide-react";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function Navbar() {

    const navigate = useNavigate();


    // ================= STATES =================

    const [menuOpen, setMenuOpen] = useState(false);

    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("userLoggedIn") === "true"
    );

    const [cartCount, setCartCount] = useState(0);

    const [logoutLoading, setLogoutLoading] = useState(false);


    // ================= GET CART COUNT =================

    const fetchCartCount = async () => {

        try {

            const response = await axiosInstance.get(
                API_ENDPOINTS.USER.IS_AUTH
            );


            console.log(
                "Navbar User Response:",
                response.data
            );


            if (response.data.success) {

                const cartItems =
                    response.data.user?.cartItems || {};


                const totalItems =
                    Object.values(cartItems).reduce(
                        (total, item) => {

                            return (
                                total +
                                (Number(item?.quantity) || 0)
                            );

                        },
                        0
                    );


                setCartCount(totalItems);

            } else {

                setCartCount(0);

            }

        } catch (error) {

            console.log(
                "Navbar Cart Count Error:",
                error
            );

            setCartCount(0);

        }

    };


    // ================= CHECK LOGIN =================

    useEffect(() => {

        const checkLogin = () => {

            const loggedIn =
                localStorage.getItem("userLoggedIn") === "true";


            setIsLoggedIn(loggedIn);


            if (loggedIn) {

                fetchCartCount();

            } else {

                setCartCount(0);

            }

        };


        checkLogin();


        window.addEventListener(
            "storage",
            checkLogin
        );


        return () => {

            window.removeEventListener(
                "storage",
                checkLogin
            );

        };

    }, []);


    // ================= SEARCH =================

    const handleSearch = (event) => {

        if (event.key === "Enter") {

            const search = searchTerm.trim();


            if (search) {

                navigate(
                    `/products?search=${encodeURIComponent(search)}`
                );

            } else {

                navigate("/products");

            }

        }

    };


    // ================= LOGOUT =================

    const handleLogout = async () => {

        if (logoutLoading) {
            return;
        }


        setLogoutLoading(true);


        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.USER.LOGOUT
            );


            console.log(
                "User Logout Response:",
                response.data
            );


            if (response.data.success) {

                localStorage.removeItem("token");

                localStorage.removeItem(
                    "userLoggedIn"
                );

                localStorage.removeItem(
                    "userId"
                );

                localStorage.removeItem(
                    "cartItems"
                );


                // Reset navbar state

                setIsLoggedIn(false);

                setCartCount(0);

                setUserMenuOpen(false);


                toast.success(
                    "Logged out successfully!"
                );


                navigate("/user");


            } else {

                toast.error(
                    response.data.message ||
                    "Logout failed"
                );

            }

        } catch (error) {

            console.log(
                "User Logout Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );

        } finally {

            setLogoutLoading(false);

        }

    };


    // ================= MY ORDERS =================

    const handleMyOrders = () => {

        setUserMenuOpen(false);

        navigate("/my-orders");

    };


    return (

        <nav className="navbar">


            {/* ================= LOGO ================= */}

            <div
                className="navbar-brand"
                onClick={() => navigate("/")}
            >

                <img
                    src={logo}
                    alt="GrocerWiseQ-Logo"
                />

                <h1>
                    GrocerWiseQ
                </h1>

            </div>


            {/* ================= NAVBAR LINKS ================= */}

            <div className="navbar-links">

                <a href="/">
                    Home
                </a>

                <a href="/products">
                    All Products
                </a>

                <a href="/">
                    About
                </a>

            </div>


            {/* ================= SEARCH ================= */}

            <div className="navbar-search">

                <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    onKeyDown={handleSearch}
                />

            </div>


            {/* ================= CART ================= */}

            <div className="navbar-cart">

                <a
                    href="/cart"
                    className="navbar-cart"
                >

                    <ShoppingCart size={22} />


                    <span className="cart-count">

                        {cartCount}

                    </span>

                </a>

            </div>


            {/* ================= USER / LOGIN ================= */}

            {isLoggedIn ? (

                <div className="user-menu-container">

                    <button
                        className="user-icon-button"
                        onClick={() =>
                            setUserMenuOpen(!userMenuOpen)
                        }
                    >

                        <User size={22} />

                    </button>


                    {userMenuOpen && (

                        <div className="user-dropdown">

                            <button
                                onClick={handleMyOrders}
                            >
                                My Orders
                            </button>


                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                            >

                                {logoutLoading ? (
                                    "Logging out..."
                                ) : (
                                    "Logout"
                                )}

                            </button>

                        </div>

                    )}

                </div>

            ) : (

                <a
                    href="/user"
                    className="login-button"
                >
                    Login
                </a>

            )}


            {/* ================= MOBILE MENU BUTTON ================= */}

            <button
                className="menu-button"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
            >

                <Menu size={24} />

            </button>


            {/* ================= MOBILE MENU ================= */}

            {menuOpen && (

                <div className="mobile-menu">

                    <a href="/">
                        Home
                    </a>

                    <a href="/products">
                        All Products
                    </a>

                    <a href="/">
                        About
                    </a>

                    <a href="/cart">
                        Cart
                    </a>


                    {isLoggedIn ? (

                        <>

                            <button
                                onClick={handleMyOrders}
                            >
                                My Orders
                            </button>


                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <a href="/user">
                            Login
                        </a>

                    )}

                </div>

            )}

        </nav>

    );

}

export default Navbar;