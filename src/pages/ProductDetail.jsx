import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import "./ProductDetail.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function ProductDetail() {

    const { category, id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);


    // =========================================================
    // GET PRODUCT DETAILS
    // =========================================================

    const fetchProduct = async () => {

        try {

            setLoading(true);

            console.log("Product ID:", id);

            const response = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.DETAIL,
                {
                    params: {
                        id: id
                    }
                }
            );

            console.log(
                "Product Detail Response:",
                response.data
            );


            if (response.data.success && response.data.product) {

                setProduct(response.data.product);

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to load product"
                );

            }

        } catch (error) {

            console.log(
                "Product Detail Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load product"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // GET RELATED PRODUCTS
    // =========================================================

    const fetchRelatedProducts = async () => {

        try {

            setRelatedLoading(true);

            const response = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.LIST
            );

            console.log(
                "All Products For Related Products:",
                response.data
            );


            if (
                response.data.success &&
                Array.isArray(response.data.products)
            ) {

                const allProducts = response.data.products;


                /*
                 * We use the category from the URL.
                 * If category is encoded in the URL,
                 * decode it before comparing.
                 */

                const currentCategory =
                    decodeURIComponent(category || "");


                const filteredProducts = allProducts.filter(
                    (item) => {

                        const sameCategory =
                            item.category?.toLowerCase() ===
                            currentCategory.toLowerCase();

                        const differentProduct =
                            item._id !== id;

                        return (
                            sameCategory &&
                            differentProduct
                        );

                    }
                );


                console.log(
                    "Related Products:",
                    filteredProducts
                );


                setRelatedProducts(filteredProducts);

            } else {

                setRelatedProducts([]);

            }

        } catch (error) {

            console.log(
                "Related Products Error:",
                error
            );

            setRelatedProducts([]);

        } finally {

            setRelatedLoading(false);

        }

    };

// =========================================================
// GET USER ID
// =========================================================

const getUserId = () => {

    return localStorage.getItem("userId");

};


// =========================================================
// ADD TO CART
// =========================================================

// =========================================================
// ADD TO CART
// =========================================================

const handleAddToCart = async () => {

    if (!product?._id) {

        toast.error(
            "Product ID not found"
        );

        return;

    }


    const userId = getUserId();


    if (!userId) {

        toast.error(
            "Please login to add products to cart"
        );

        navigate("/user");

        return;

    }


    try {

        // ================= GET CURRENT USER =================

        const userResponse =
            await axiosInstance.get(
                API_ENDPOINTS.USER.IS_AUTH
            );


        if (
            !userResponse.data.success ||
            !userResponse.data.user
        ) {

            toast.error(
                "Please login to add products to cart"
            );

            navigate("/user");

            return;

        }


        const user =
            userResponse.data.user;


        // ================= GET CURRENT CART =================

        const existingCart =
            user.cartItems || {};


        // ================= CURRENT QUANTITY =================

        const currentQuantity =
            existingCart[product._id]?.quantity || 0;


        // ================= UPDATE ONLY THIS PRODUCT =================

        const updatedCart = {

            ...existingCart,

            [product._id]: {

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


        toast.error(
            error.response?.data?.message ||
            "Failed to add product"
        );

    }

};


    // =========================================================
    // LOAD PRODUCT
    // =========================================================

    useEffect(() => {

        if (!id) {
            return;
        }

        fetchProduct();

    }, [id]);


    // =========================================================
    // LOAD RELATED PRODUCTS
    // =========================================================

    useEffect(() => {

        if (!category || !id) {
            return;
        }

        fetchRelatedProducts();

    }, [category, id]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="product-detail-page">

                <Navbar />

                <div className="product-detail-loading">

                    <span className="loading-spinner"></span>

                </div>

            </div>

        );

    }


    // =========================================================
    // PRODUCT NOT FOUND
    // =========================================================

    if (!product) {

        return (

            <div className="product-detail-page">

                <Navbar />

                <div className="product-not-found">

                    <h2>
                        Product not found
                    </h2>

                    <button
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // PRODUCT IMAGES
    // =========================================================

    const productImages =
        Array.isArray(product.image)
            ? product.image
            : [];


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="product-detail-page">

            <Navbar />


            {/* =================================================
                PRODUCT DETAIL
            ================================================= */}

            <section className="product-detail-section">

                <div className="product-detail-container">


                    {/* ================= IMAGES ================= */}

                    <div className="product-detail-images">


                        {/* THUMBNAILS */}

                        <div className="product-thumbnail-container">

                            {productImages.map(
                                (image, index) => (

                                    <button
                                        type="button"
                                        className={
                                            selectedImage === index
                                                ? "product-thumbnail active"
                                                : "product-thumbnail"
                                        }
                                        key={index}
                                        onClick={() =>
                                            setSelectedImage(index)
                                        }
                                    >

                                        <img
                                            src={image}
                                            alt={
                                                product.name +
                                                " " +
                                                (index + 1)
                                            }
                                        />

                                    </button>

                                )
                            )}

                        </div>


                        {/* MAIN IMAGE */}

                        <div className="product-main-image">

                            {productImages.length > 0 ? (

                                <img
                                    src={
                                        productImages[
                                            selectedImage
                                        ]
                                    }
                                    alt={product.name}
                                />

                            ) : (

                                <div className="no-product-image">
                                    No Image
                                </div>

                            )}

                        </div>

                    </div>


                    {/* ================= INFORMATION ================= */}

                    <div className="product-detail-info">


                        <p className="product-detail-category">

                            {product.category}

                        </p>


                        <h1>
                            {product.name}
                        </h1>


                        {/* PRICE */}

                        <div className="product-detail-price">

                            <span className="offer-price">

                                ₹{product.offerPrice}

                            </span>


                            {product.price !== product.offerPrice && (

                                <span className="original-price">

                                    ₹{product.price}

                                </span>

                            )}

                        </div>


                        {/* STOCK */}

                        <div className="product-stock">

                            {product.inStock ? (

                                <span className="in-stock">
                                    In Stock
                                </span>

                            ) : (

                                <span className="out-of-stock">
                                    Out of Stock
                                </span>

                            )}

                        </div>


                        {/* DESCRIPTION */}

                        <div className="product-description">

                            <h3>
                                Product Description
                            </h3>


                            {Array.isArray(product.description) ? (

                                product.description.map(
                                    (description, index) => (

                                        <p key={index}>
                                            {description}
                                        </p>

                                    )
                                )

                            ) : (

                                <p>
                                    {product.description}
                                </p>

                            )}

                        </div>


                        {/* ADD TO CART */}

                        <button
                            type="button"
                            className="add-to-cart-button"
                            disabled={!product.inStock}
                            onClick={handleAddToCart}
                        >

                            {product.inStock
                                ? "Add to Cart"
                                : "Out of Stock"
                            }

                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                RELATED PRODUCTS
            ================================================= */}

            <section className="related-products-section">

                <div className="related-products-container">

                    <h2>
                        Related Products
                    </h2>


                    {relatedLoading ? (

                        <div className="related-products-loading">

                            <span className="loading-spinner"></span>

                        </div>

                    ) : relatedProducts.length === 0 ? (

                        <div className="no-related-products">

                            <p>
                                No related products found.
                            </p>

                        </div>

                    ) : (

                        <div className="related-products-grid">

                            {relatedProducts.map(
                                (relatedProduct) => (

                                    <div
                                        className="related-product-card"
                                        key={relatedProduct._id}
                                        onClick={() =>
                                            navigate(
                                                `/products/${encodeURIComponent(
                                                    relatedProduct.category
                                                )}/${relatedProduct._id}`
                                            )
                                        }
                                    >


                                        {/* IMAGE */}

                                        <div className="related-product-image">

                                            {relatedProduct.image?.[0] ? (

                                                <img
                                                    src={
                                                        relatedProduct.image[0]
                                                    }
                                                    alt={
                                                        relatedProduct.name
                                                    }
                                                />

                                            ) : (

                                                <div className="no-related-image">
                                                    No Image
                                                </div>

                                            )}

                                        </div>


                                        {/* CATEGORY */}

                                        <p className="related-product-category">

                                            {relatedProduct.category}

                                        </p>


                                        {/* NAME */}

                                        <h3>

                                            {relatedProduct.name}

                                        </h3>


                                        {/* PRICE */}

                                        <div className="related-product-bottom">

                                            <div>

                                                <span className="related-offer-price">

                                                    ₹
                                                    {
                                                        relatedProduct.offerPrice
                                                    }

                                                </span>


                                                {relatedProduct.price !==
                                                    relatedProduct.offerPrice && (

                                                    <span className="related-original-price">

                                                        ₹
                                                        {
                                                            relatedProduct.price
                                                        }

                                                    </span>

                                                )}

                                            </div>


                                            {/* STOCK */}

                                            {!relatedProduct.inStock && (

                                                <span className="related-out-of-stock">

                                                    Out of Stock

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>


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


export default ProductDetail;