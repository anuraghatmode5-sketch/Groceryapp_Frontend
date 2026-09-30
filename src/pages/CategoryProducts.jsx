import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import "./CategoryProducts.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function CategoryProducts() {

    const navigate = useNavigate();

    const { category } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // FETCH ALL PRODUCTS
    // =========================================================

    const fetchProducts = async () => {

        try {

            const response = await axiosInstance.get(
                "/api/product/list"
            );


            console.log(
                "All Products Response:",
                response.data
            );


            if (response.data.success) {

                const allProducts =
                    response.data.products || [];


                // =================================================
                // FILTER PRODUCTS BY CATEGORY
                // =================================================

                const filteredProducts =
                    allProducts.filter((product) => {

                        return (
                            product.category?.toLowerCase() ===
                            category?.toLowerCase()
                        );

                    });


                console.log(
                    "Category:",
                    category
                );


                console.log(
                    "Filtered Products:",
                    filteredProducts
                );


                setProducts(filteredProducts);

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to load products"
                );

            }

        } catch (error) {

            console.log(
                "Fetch Category Products Error:",
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
    // FETCH WHEN CATEGORY CHANGES
    // =========================================================

    useEffect(() => {

        fetchProducts();

    }, [category]);


    // =========================================================
    // OPEN PRODUCT DETAIL
    // =========================================================

    const openProduct = (product) => {

        /*
         * Backend ProductDto uses:
         *
         * @JsonProperty("_id")
         * private String id;
         *
         * Therefore frontend receives:
         *
         * product._id
         */

        const productId = product._id;


        console.log(
            "Opening Product:",
            product
        );


        console.log(
            "Product ID:",
            productId
        );


        if (!productId) {

            toast.error(
                "Product ID not found"
            );

            return;

        }


        navigate(
            `/products/${encodeURIComponent(
                product.category
            )}/${productId}`
        );

    };


    // =========================================================
    // ADD TO CART
    // =========================================================

    const handleAddToCart = async (event, product) => {

        event.stopPropagation();


        // ================= PRODUCT ID =================

        if (!product?._id) {

            toast.error(
                "Product ID not found"
            );

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


            // ================= CURRENT CART =================

            const currentCart =
                userResponse.data.user?.cartItems || {};


            // ================= CURRENT QUANTITY =================

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

                // Keep localStorage synchronized

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
    // CATEGORY TITLE
    // =========================================================

    const categoryTitle = category
        ? category.replace(
            /\b\w/g,
            (char) => char.toUpperCase()
        )
        : "Products";


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="category-products-page">

                <Navbar />


                <div className="category-products-loading">

                    <div className="category-loading-spinner"></div>

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

        <div className="category-products-page">

            <Navbar />


            {/* =================================================
                PRODUCTS SECTION
            ================================================= */}

            <main className="category-products-container">


                {/* =================================================
                    HEADING
                ================================================= */}

                <h1 className="category-products-title">

                    {categoryTitle}

                </h1>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {products.length === 0 ? (

                    <div className="category-no-products">

                        <h2>
                            No products found
                        </h2>

                        <p>
                            No products are available in this category.
                        </p>

                    </div>

                ) : (

                    <div className="category-products-grid">

                        {products.map((product) => (

                            <div
                                className="category-product-card"
                                key={product._id}
                                onClick={() =>
                                    openProduct(product)
                                }
                            >


                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div className="category-product-image">

                                    <img
                                        src={
                                            product.image?.[0]
                                        }
                                        alt={
                                            product.name
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    CATEGORY
                                ================================================= */}

                                <p className="category-product-category">

                                    {product.category}

                                </p>


                                {/* =================================================
                                    NAME
                                ================================================= */}

                                <h3 className="category-product-name">

                                    {product.name}

                                </h3>


                                {/* =================================================
                                    BOTTOM
                                ================================================= */}

                                <div className="category-product-bottom">


                                    {/* PRICE */}

                                    <div className="category-product-price">

                                        <span className="category-offer-price">

                                            ₹
                                            {product.offerPrice}

                                        </span>


                                        {
                                            product.price !==
                                            product.offerPrice
                                            &&
                                            (

                                                <span className="category-original-price">

                                                    ₹
                                                    {product.price}

                                                </span>

                                            )
                                        }

                                    </div>


                                    {/* =================================================
                                        STOCK BUTTON
                                    ================================================= */}

                                    {product.inStock ? (

                                        <button
                                            className="category-add-button"
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
                                            className="category-out-stock-button"
                                            disabled
                                            onClick={(event) => {

                                                event.stopPropagation();

                                            }}
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

            <footer className="category-footer">


                <div className="category-footer-content">


                    {/* BRAND */}

                    <div className="category-footer-brand">

                        <div className="category-footer-logo">

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


                    {/* QUICK LINKS */}

                    <div className="category-footer-column">

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


                    {/* CUSTOMER */}

                    <div className="category-footer-column">

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


                    {/* CONTACT */}

                    <div className="category-footer-column">

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


                {/* FOOTER BOTTOM */}

                <div className="category-footer-bottom">

                    <p>
                        © 2026 GrocerWiseQ. All Rights Reserved.
                    </p>


                    <div className="category-footer-bottom-links">

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


export default CategoryProducts;