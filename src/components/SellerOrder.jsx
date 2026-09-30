import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import "./SellerOrder.css";

function SellerOrders() {

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [ordersResponse, productsResponse] =
                    await Promise.all([
                        axiosInstance.get("/api/order/all"),
                        axiosInstance.get("/api/product/list")
                    ]);

                setOrders(ordersResponse.data);
                setProducts(productsResponse.data.products);

            } catch (error) {

                console.log(
                    "Error fetching orders:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, []);


    /* ================= PRODUCT NAME ================= */

    const getProductName = (productId) => {

        const product = products.find(
            (product) => product._id === productId
        );

        return product
            ? product.name
            : "Product";

    };


    /* ================= GROUP ORDERS BY USER ================= */

    const groupedOrders = {};

    orders.forEach((order) => {

        if (!groupedOrders[order.userId]) {

            groupedOrders[order.userId] = {

                userId: order.userId,

                items: [],

                amount: 0,

                paymentType: order.paymentType,

                isPaid: order.isPaid,

                status: order.status,

                createdAt: order.createdAt

            };

        }


        /* ================= TOTAL AMOUNT ================= */

        groupedOrders[order.userId].amount +=
            order.amount || 0;


        /* ================= ITEMS ================= */

        order.items?.forEach((item) => {

            const existingItem =
                groupedOrders[order.userId].items.find(
                    (existing) =>
                        existing.product === item.product
                );

            if (existingItem) {

                existingItem.quantity +=
                    item.quantity;

            } else {

                groupedOrders[order.userId].items.push({

                    product: item.product,

                    quantity: item.quantity

                });

            }

        });

    });


    const userOrders =
        Object.values(groupedOrders);


    if (loading) {

        return (

            <div className="seller-orders">

                <div className="seller-orders-container">

                    <h2>Orders List</h2>

                    <p>Loading orders...</p>

                </div>

            </div>

        );

    }


    return (

        <div className="seller-orders">

            <div className="seller-orders-container">

                <h2>Orders List</h2>

                <div className="orders-list">

                    {userOrders.length === 0 ? (

                        <p>No orders found.</p>

                    ) : (

                        userOrders.map((userOrder) => (

                            <div
                                className="seller-order-card"
                                key={userOrder.userId}
                            >

                                {/* ================= PRODUCTS ================= */}

                                <div className="seller-order-items">

                                    {userOrder.items.map(
                                        (item) => (

                                            <div
                                                className="seller-order-item"
                                                key={item.product}
                                            >

                                                <div className="seller-product-image">
                                                    🛒
                                                </div>

                                                <div>

                                                    <strong>
                                                        {getProductName(
                                                            item.product
                                                        )}
                                                    </strong>

                                                    <p>
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* ================= USER ================= */}

                                <div className="seller-user-details">

                                    <strong>
                                        User ID
                                    </strong>

                                    <p>
                                        {userOrder.userId}
                                    </p>

                                </div>


                                {/* ================= ORDER DETAILS ================= */}

                                <div className="seller-order-details">

                                    <strong>
                                        ₹{userOrder.amount}
                                    </strong>

                                    <p>
                                        Payment:{" "}
                                        {userOrder.paymentType}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        {userOrder.status}
                                    </p>

                                    <p>
                                        Payment:{" "}
                                        {userOrder.isPaid
                                            ? "Paid"
                                            : "Pending"}
                                    </p>

                                    <p>
                                        Date:{" "}
                                        {userOrder.createdAt
                                            ? new Date(
                                                userOrder.createdAt
                                            ).toLocaleDateString()
                                            : ""}
                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default SellerOrders;