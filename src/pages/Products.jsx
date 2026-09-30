import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import "./Products.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function Products() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // SEARCH
    // =========================================================

    const searchTerm = searchParams.get("search") || "";


    // =========================================================
    // FETCH ALL PRODUCTS
    // =========================================================

    const fetchProducts = async () => {

        try {

            const response = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.LIST
            );

            console.log(
                "All Products Response:",
                response.data
            );


            if (response.data.success) {

                setProducts(
                    response.data.products || []
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to load products"
                );

            }

        } catch (error) {

            console.log(
                "Fetch Products Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOAD PRODUCTS
    // =========================================================

    useEffect(() => {

        fetchProducts();

    }, []);


    // =========================================================
    // OPEN PRODUCT DETAIL
    // =========================================================

    const openProduct = (product) => {

        console.log(
            "Clicked Product:",
            product
        );


        console.log(
            "Product ID:",
            product._id
        );


        console.log(
            "Product Category:",
            product.category
        );


        if (!product._id) {

            toast.error(
                "Product ID not found"
            );

            return;

        }


        navigate(
            `/products/${encodeURIComponent(product.category)}/${product._id}`
        );

    };


    // =========================================================
    // GET USER ID
    // =========================================================

    const getUserId = () => {

        const userId =
            localStorage.getItem("userId");

        return userId;

    };


    // =========================================================
    // ADD TO CART
    // =========================================================

// =========================================================
// ADD TO CART
// =========================================================

const handleAddToCart = async (event, product) => {

    event.stopPropagation();


    // ================= PRODUCT ID =================

    if (!product?._id) {

        toast.error("Product ID not found");

        return;

    }


    // ================= USER ID =================

    const userId =
        localStorage.getItem("userId");


    if (!userId) {

        toast.error(
            "Please login to add products to cart"
        );

        navigate("/user");

        return;

    }


    try {

        // ================= GET CURRENT CART =================
        // Get the latest cart from backend

        const userResponse =
            await axiosInstance.get(
                API_ENDPOINTS.USER.IS_AUTH
            );


        if (!userResponse.data.success) {

            toast.error(
                "Please login to add products to cart"
            );

            navigate("/user");

            return;

        }


        const currentCart =
            userResponse.data.user?.cartItems || {};


        // ================= CURRENT PRODUCT QUANTITY =================

        const currentQuantity =
            currentCart[product._id]?.quantity || 0;


        // ================= UPDATE ONLY THIS PRODUCT =================

        const updatedCart = {

            ...currentCart,

            [product._id]: {

                quantity:
                    currentQuantity + 1

            }

        };


        console.log(
            "Updated Cart:",
            updatedCart
        );


        // ================= UPDATE BACKEND =================

        const response =
            await axiosInstance.post(

                API_ENDPOINTS.CART.UPDATE,

                {
                    userId: userId,
                    cartItems: updatedCart
                }

            );


        console.log(
            "Cart Update Response:",
            response.data
        );


        // ================= SUCCESS =================

        if (response.data.success) {

            // Keep localStorage in sync
            localStorage.setItem(
                "cartItems",
                JSON.stringify(updatedCart)
            );


            toast.success(
                `${product.name} added to cart`
            );

        } else {

            toast.error(
                response.data.message ||
                "Failed to add product"
            );

        }


    } catch (error) {

        console.log(
            "Add To Cart Error:",
            error
        );


        if (error.response?.status === 401) {

            toast.error(
                "Please login to add products to cart"
            );

            navigate("/user");

        } else {

            toast.error(
                error.response?.data?.message ||
                "Failed to add product"
            );

        }

    }

};


    // =========================================================
    // FILTER PRODUCTS
    // =========================================================

    const filteredProducts = products.filter((product) => {

        if (!searchTerm.trim()) {

            return true;

        }


        return product.name
            ?.toLowerCase()
            .includes(
                searchTerm.trim().toLowerCase()
            );

    });


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="products-page">

                <Navbar />

                <div className="products-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading products...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="products-page">

            <Navbar />


            <main className="all-products-container">

                <h1 className="all-products-title">

                    {searchTerm
                        ? `SEARCH RESULTS FOR "${searchTerm}"`
                        : "ALL PRODUCTS"}

                </h1>


                {filteredProducts.length === 0 ? (

                    <div className="no-products">

                        <h2>
                            No products found
                        </h2>

                        <p>

                            {searchTerm
                                ? `No products found for "${searchTerm}".`
                                : "Products will appear here when they are added."}

                        </p>

                    </div>

                ) : (

                    <div className="all-products-grid">

                        {filteredProducts.map((product) => (

                            <div
                                className="all-product-card"
                                key={product._id}
                                onClick={() =>
                                    openProduct(product)
                                }
                            >

                                <div className="all-product-image">

                                    <img
                                        src={product.image?.[0]}
                                        alt={product.name}
                                    />

                                </div>


                                <p className="all-product-category">

                                    {product.category}

                                </p>


                                <h3 className="all-product-name">

                                    {product.name}

                                </h3>


                                <div className="all-product-bottom">

                                    <div className="all-product-price">

                                        <span className="offer-price">

                                            ₹{product.offerPrice}

                                        </span>


                                        {product.price !==
                                            product.offerPrice && (

                                            <span className="original-price">

                                                ₹{product.price}

                                            </span>

                                        )}

                                    </div>


                                    {product.inStock ? (

                                        <button
                                            className="add-product-button"

                                            onClick={(event) =>
                                                handleAddToCart(
                                                    event,
                                                    product
                                                )
                                            }
                                        >

                                            🛒 Add

                                        </button>

                                    ) : (

                                        <button
                                            className="out-stock-button"
                                            disabled
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >

                                            Out of Stock

                                        </button>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="footer">

                <div className="footer-content">

                    <div className="footer-brand">

                        <div className="footer-logo">

                            🛒

                            <span>
                                GrocerWiseQ
                            </span>

                        </div>

                        <p>

                            Fresh groceries and everyday essentials
                            delivered straight to your doorstep.
                            Simple, fresh and affordable.

                        </p>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Quick Links
                        </h3>

                        <a href="/">
                            Home
                        </a>

                        <a href="/products">
                            All Products
                        </a>

                        <a href="/about">
                            About Us
                        </a>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Customer
                        </h3>

                        <a href="/user">
                            My Account
                        </a>

                        <a href="/cart">
                            Cart
                        </a>

                        <a href="#">
                            Orders
                        </a>

                    </div>


                    <div className="footer-column">

                        <h3>
                            Contact Us
                        </h3>

                        <p>
                            📧 support@grocerwiseq.com
                        </p>

                        <p>
                            📞 +91 987652 432103
                        </p>

                        <p>
                            📍 Nagpur, Maharashtra
                        </p>

                    </div>

                </div>


                <div className="footer-bottom">

                    <p>
                        © 2026 GrocerWiseQ. All Rights Reserved.
                    </p>

                    <div className="footer-bottom-links">

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Terms & Conditions
                        </a>

                    </div>

                </div>

            </footer>

        </div>

    );

}


export default Products;