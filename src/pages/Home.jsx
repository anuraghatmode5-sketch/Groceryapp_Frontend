import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import "./Home.css";

import heroImageo from "../assets/heroimg1.png";

import organicVeggies from "../assets/organic-veggies.png";
import freshFruits from "../assets/fresh-fruits.png";
import coldDrinks from "../assets/cold-drinks.png";
import instantFoods from "../assets/instant-foods.png";
import dairy from "../assets/dairy.png";
import bakery from "../assets/bakery.png";
import grains from "../assets/grains.png";

import whyBestImage from "../assets/banner2.png";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function Home() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    // ================= GET PRODUCTS =================

    const fetchProducts = async () => {

        try {

            const response = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.LIST
            );

            console.log(
                "Home Product Response:",
                response.data
            );

            if (response.data.success) {

                setProducts(
                    response.data.products || []
                );

            }

        } catch (error) {

            console.log(
                "Home Product Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ================= LOAD PRODUCTS =================

    useEffect(() => {

        fetchProducts();

    }, []);


    // ================= ADD TO CART =================

    const handleAddToCart = async (event, product) => {

        event.stopPropagation();


        // ================= PRODUCT ID =================

        const productId =
            product.id || product._id;


        if (!productId) {

            toast.error(
                "Product ID is missing"
            );

            console.log(
                "Product ID Missing:",
                product
            );

            return;

        }


        try {

            // ================= CURRENT USER =================

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


            const user =
                userResponse.data.user;


            const userId =
                user?.id;


            if (!userId) {

                toast.error(
                    "User ID not found"
                );

                return;

            }


            // ================= EXISTING CART =================

            const currentCartItems =
                user?.cartItems || {};


            const currentQuantity =
                currentCartItems[productId]?.quantity || 0;


            // ================= UPDATED CART =================

            const updatedCartItems = {

                ...currentCartItems,

                [productId]: {

                    quantity:
                        currentQuantity + 1

                }

            };


            // ================= UPDATE BACKEND =================

            const response =
                await axiosInstance.post(
                    API_ENDPOINTS.CART.UPDATE,
                    {
                        userId: userId,
                        cartItems: updatedCartItems
                    }
                );


            console.log(
                "Add To Cart Response:",
                response.data
            );


            if (response.data.success) {

                toast.success(
                    `${product.name} added to cart`
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to add product to cart"
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
                    "Failed to add product to cart"
                );

            }

        }

    };


    // ================= PRODUCT CLICK =================

    const handleProductClick = (product) => {

        // Backend may return id or _id
        const productId =
            product.id || product._id;

        console.log(
            "Clicked Product:",
            product
        );

        console.log(
            "Product ID:",
            productId
        );


        if (!productId) {

            console.log(
                "Product ID is missing"
            );

            return;

        }


        navigate(
            `/products/${encodeURIComponent(
                product.category
            )}/${productId}`
        );

    };


    // ================= CATEGORY CLICK =================

    const handleCategoryClick = (category) => {

        navigate(
            `/products/category/${encodeURIComponent(category)}`
        );

    };


    return (

        <div className="home-page">

            <Navbar />


            {/* ================= HERO ================= */}

            <div className="hero">

                <img
                    src={heroImageo}
                    alt="Fresh groceries"
                />

            </div>


            <div className="home-sections">


                {/* ================= CATEGORIES ================= */}

                <section className="categories-section">

                    <h2>
                        Categories
                    </h2>


                    <div className="categories-grid">


                        {/* ================= ORGANIC VEGGIES ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Organic veggies")
                            }
                        >

                            <img
                                src={organicVeggies}
                                alt="Organic veggies"
                            />

                            <p>
                                Organic veggies
                            </p>

                        </div>


                        {/* ================= FRESH FRUITS ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Fresh Fruits")
                            }
                        >

                            <img
                                src={freshFruits}
                                alt="Fresh Fruits"
                            />

                            <p>
                                Fresh Fruits
                            </p>

                        </div>


                        {/* ================= COLD DRINKS ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Cold Drinks")
                            }
                        >

                            <img
                                src={coldDrinks}
                                alt="Cold Drinks"
                            />

                            <p>
                                Cold Drinks
                            </p>

                        </div>


                        {/* ================= INSTANT FOODS ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Instant Foods")
                            }
                        >

                            <img
                                src={instantFoods}
                                alt="Instant Foods"
                            />

                            <p>
                                Instant Foods
                            </p>

                        </div>


                        {/* ================= DAIRY ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Dairy")
                            }
                        >

                            <img
                                src={dairy}
                                alt="Dairy"
                            />

                            <p>
                                Dairy
                            </p>

                        </div>


                        {/* ================= Bakery & Breads ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Bakery & Breads")
                            }
                        >

                            <img
                                src={bakery}
                                alt="Bakery & Breads"
                            />

                            <p>
                                Bakery & Breads
                            </p>

                        </div>


                        {/* ================= GRAINS & CEREALS ================= */}

                        <div
                            className="category-card"
                            onClick={() =>
                                handleCategoryClick("Grains & Cereals")
                            }
                        >

                            <img
                                src={grains}
                                alt="Grains & Cereals"
                            />

                            <p>
                                Grains & Cereals
                            </p>

                        </div>


                    </div>

                </section>


                {/* ================= BEST SELLERS ================= */}

                <section className="best-sellers-section">

                    <h2>
                        Best Sellers
                    </h2>


                    {loading ? (

                        <div className="products-loading">

                            Loading products...

                        </div>

                    ) : products.length === 0 ? (

                        <div className="no-products">

                            No products available.

                        </div>

                    ) : (

                        <div className="products-grid">

                            {products.map((product) => {

                                const productId =
                                    product.id ||
                                    product._id;


                                return (

                                    <div
                                        className="product-card"
                                        key={productId}
                                        onClick={() =>
                                            handleProductClick(product)
                                        }
                                    >


                                        {/* ================= IMAGE ================= */}

                                        <img
                                            src={product.image?.[0]}
                                            alt={product.name}
                                        />


                                        {/* ================= CATEGORY ================= */}

                                        <p className="product-category">

                                            {product.category}

                                        </p>


                                        {/* ================= NAME ================= */}

                                        <h3>

                                            {product.name}

                                        </h3>


                                        {/* ================= PRICE ================= */}

                                        <div className="product-bottom">

                                            <span>

                                                ₹{product.offerPrice}

                                            </span>


                                            <button
                                                type="button"
                                                disabled={
                                                    !product.inStock
                                                }
                                                onClick={(event) =>
                                                    handleAddToCart(
                                                        event,
                                                        product
                                                    )
                                                }
                                            >

                                                {product.inStock
                                                    ? "Add"
                                                    : "Out of Stock"}

                                            </button>

                                        </div>


                                    </div>

                                );

                            })}

                        </div>

                    )}

                </section>


            </div>


            {/* ================= WHY BEST ================= */}

            <section className="why-best-section">

                <img
                    src={whyBestImage}
                    alt="Why we are the best"
                />

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="footer">

                <div className="footer-content">


                    {/* BRAND */}

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


                    {/* QUICK LINKS */}

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


                    {/* CUSTOMER */}

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


                    {/* CONTACT */}

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


                {/* ================= FOOTER BOTTOM ================= */}

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


export default Home;