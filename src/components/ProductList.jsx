import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import "./ProductList.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function ProductList() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingProductId, setUpdatingProductId] = useState(null);


    // ================= GET PRODUCTS =================

    const fetchProducts = async () => {

        try {

            const response = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.LIST
            );

            console.log(
                "Product List Response:",
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
                "Product List Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load products";

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    // ================= LOAD PRODUCTS =================

    useEffect(() => {

        fetchProducts();

    }, []);


    // ================= STOCK UPDATE =================

    const handleStockChange = async (product) => {

        if (!product || !product._id) {

            console.log(
                "Invalid product:",
                product
            );

            toast.error(
                "Product information is missing"
            );

            return;
        }


        // Toggle stock status

        const newStockStatus = !product.inStock;


        console.log(
            "Updating stock:",
            {
                id: product._id,
                inStock: newStockStatus
            }
        );


        setUpdatingProductId(product._id);


        try {

            const response = await axiosInstance.post(
                API_ENDPOINTS.PRODUCT.STOCK,
                {
                    id: product._id,
                    inStock: newStockStatus
                }
            );


            console.log(
                "Stock Update Response:",
                response.data
            );


            if (response.data.success) {

                // Update product in frontend

                setProducts((previousProducts) =>

                    previousProducts.map((item) =>

                        item._id === product._id

                            ? {
                                ...item,
                                inStock: newStockStatus
                            }

                            : item

                    )

                );


                toast.success(
                    newStockStatus
                        ? "Product is now in stock"
                        : "Product is now out of stock"
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to update stock"
                );

            }

        } catch (error) {

            console.log(
                "Stock Update Error:",
                error
            );


            console.log(
                "Status:",
                error.response?.status
            );


            console.log(
                "Backend Response:",
                error.response?.data
            );


            console.log(
                "Request Data:",
                error.config?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to update stock"
            );

        } finally {

            setUpdatingProductId(null);

        }

    };


    // ================= LOADING =================

    if (loading) {

        return (

            <div className="product-list">

                <div className="product-list-container">

                    <h2>
                        All Products
                    </h2>


                    <div className="product-list-loading">

                        <span className="loading-spinner"></span>

                    </div>

                </div>

            </div>

        );

    }


    // ================= PRODUCT LIST =================

    return (

        <div className="product-list">

            <div className="product-list-container">

                <h2>
                    All Products
                </h2>


                <div className="products-table">


                    {/* ================= TABLE HEADER ================= */}

                    <div className="product-table-header">

                        <div>
                            Product
                        </div>

                        <div>
                            Category
                        </div>

                        <div>
                            Selling Price
                        </div>

                        <div>
                            In Stock
                        </div>

                    </div>


                    {/* ================= PRODUCTS ================= */}

                    {products.length === 0 ? (

                        <div className="no-products">

                            No products found.

                        </div>

                    ) : (

                        products.map((product) => (

                            <div
                                className="product-table-row"
                                key={product._id}
                            >


                                {/* ================= PRODUCT ================= */}

                                <div className="product-info">

                                    <img
                                        src={product.image?.[0]}
                                        alt={product.name}
                                    />

                                    <span>
                                        {product.name}
                                    </span>

                                </div>


                                {/* ================= CATEGORY ================= */}

                                <div>
                                    {product.category}
                                </div>


                                {/* ================= SELLING PRICE ================= */}

                                <div>
                                    ₹{product.offerPrice}
                                </div>


                                {/* ================= STOCK ================= */}

                                <div>

                                    <label className="stock-switch">

                                        <input
                                            type="checkbox"
                                            checked={Boolean(product.inStock)}
                                            disabled={
                                                updatingProductId ===
                                                product._id
                                            }
                                            onChange={() =>
                                                handleStockChange(product)
                                            }
                                        />

                                        <span className="stock-slider"></span>

                                    </label>

                                </div>


                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}


export default ProductList;