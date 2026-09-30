import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";

import "./MyOrders.css";

import Navbar from "../components/Navbar";


function MyOrders() {

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);


    // ================= FETCH ORDERS =================

    const fetchOrders = async () => {

        try {

            const userId = localStorage.getItem("userId");

            if (!userId) {
                toast.error("Please login first");
                return;
            }


            // ================= GET ORDERS =================

            const orderResponse = await axiosInstance.get(
                `/api/order/user/${userId}`
            );


            // ================= GET PRODUCTS =================

            const productResponse = await axiosInstance.get(
                API_ENDPOINTS.PRODUCT.LIST
            );


            setOrders(orderResponse.data || []);


            setProducts(
                productResponse.data?.products || []
            );


        } catch (error) {

            console.log(
                "Fetch Orders Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load orders"
            );

        } finally {

            setLoading(false);

        }

    };


    // ================= USE EFFECT =================

    useEffect(() => {

        fetchOrders();

    }, []);


    // ================= FIND PRODUCT =================

    const getProduct = (productId) => {

        return products.find(
            product =>
                product._id === productId
        );

    };


    // ================= FORMAT DATE =================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString(
            "en-GB"
        );

    };


    // ================= LOADING =================

    if (loading) {

        return (
            <>
            <Navbar/>

            <div className="my-orders-page">

                <div className="my-orders-container">

                    <h1>
                        MY <span>ORDERS</span>
                    </h1>

                    <p className="loading-text">
                        Loading orders...
                    </p>

                </div>

            </div>
            </>

        );

    }


    // ================= NO ORDERS =================

    if (orders.length === 0) {

        return (
            <>
            <Navbar/>

            <div className="my-orders-page">

                <div className="my-orders-container">

                    <h1>
                        MY <span>ORDERS</span>
                    </h1>

                    <p className="no-orders">
                        No orders found.
                    </p>

                </div>

            </div>
            </>
        );

    }


    return (
        <>
        <Navbar/>
        <div className="my-orders-page">


            <div className="my-orders-container">

                {/* ================= HEADING ================= */}

                <h1>
                    MY <span>ORDERS</span>
                </h1>


                {/* ================= ALL ORDERS ================= */}

                {orders.map((order) => (

                    <div
                        className="order-card"
                        key={order.id}
                    >

                        {/* ================= ORDER HEADER ================= */}

                        <div className="order-header">

                            <div>

                                <strong>
                                    Order Id:
                                </strong>

                                <span>
                                    {order.id}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Payment:
                                </strong>

                                <span>
                                    {order.paymentType}
                                </span>

                            </div>


                            <div>

                                <strong>
                                    Total Amount:
                                </strong>

                                <span>
                                    ₹{order.amount}
                                </span>

                            </div>

                        </div>


                        {/* ================= ORDER ITEMS ================= */}

                        <div className="order-items">

                            {order.items?.map(
                                (item, index) => {

                                    const product =
                                        getProduct(
                                            item.product
                                        );


                                    return (

                                        <div
                                            className="order-item"
                                            key={
                                                item.product ||
                                                index
                                            }
                                        >

                                            {/* PRODUCT IMAGE */}

                                            <div className="order-product-image">

                                                {product?.image?.[0] ? (

                                                    <img
                                                        src={
                                                            product.image[0]
                                                        }
                                                        alt={
                                                            product.name ||
                                                            "Product"
                                                        }
                                                    />

                                                ) : (

                                                    <div className="no-image">
                                                        🛒
                                                    </div>

                                                )}

                                            </div>


                                            {/* PRODUCT DETAILS */}

                                            <div className="order-product-details">

                                                <h3>
                                                    {product?.name ||
                                                        "Product"}
                                                </h3>

                                                <p>
                                                    Category:{" "}
                                                    {product?.category ||
                                                        "N/A"}
                                                </p>

                                            </div>


                                            {/* QUANTITY */}

                                            <div className="order-product-info">

                                                <p>
                                                    Quantity:{" "}
                                                    <strong>
                                                        {item.quantity}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Status:{" "}
                                                    <strong>
                                                        {order.status}
                                                    </strong>
                                                </p>

                                                <p>
                                                    Date:{" "}
                                                    <strong>
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </strong>
                                                </p>

                                            </div>


                                            {/* PRODUCT AMOUNT */}

                                            <div className="order-product-amount">

                                                <span>
                                                    Amount:
                                                </span>

                                                <strong>
                                                    ₹
                                                    {(
                                                        (
                                                            product?.offerPrice ??
                                                            product?.price ??
                                                            0
                                                        ) *
                                                        item.quantity
                                                    ).toFixed(0)}
                                                </strong>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
        </>

    );

}

export default MyOrders;