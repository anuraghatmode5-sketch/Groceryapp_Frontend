import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import "./Cart.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function Cart() {

    const [showAddressPopup, setShowAddressPopup] = useState(false);

    const [cartProducts, setCartProducts] = useState([]);

    const [cartItems, setCartItems] = useState({});

    const [userId, setUserId] = useState("");

    const [loading, setLoading] = useState(true);

    const [updatingProductId, setUpdatingProductId] = useState(null);


    // ================= ADDRESS STATES =================

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState(null);


    // ================= PAYMENT STATES =================

    const [paymentMethod, setPaymentMethod] = useState("cod");

    const [placeOrderLoading, setPlaceOrderLoading] = useState(false);


    const navigate = useNavigate();


    // =========================================================
    // FETCH CART
    // =========================================================

    const fetchCart = async () => {

        try {

            setLoading(true);


            // ================= CURRENT USER =================

            const userResponse = await axiosInstance.get(
                API_ENDPOINTS.USER.IS_AUTH
            );


            console.log(
                "Current User Response:",
                userResponse.data
            );


            if (!userResponse.data.success) {

                toast.error("Please login to view cart");

                navigate("/user");

                return;

            }


            const user = userResponse.data.user;

            const currentUserId = user?.id;

            const currentCartItems =
                user?.cartItems || {};


            setUserId(currentUserId);

            setCartItems(currentCartItems);


            // ================= PRODUCT IDS =================

            const productIds =
                Object.keys(currentCartItems);


            // ================= EMPTY CART =================

            if (productIds.length === 0) {

                setCartProducts([]);

                return;

            }


            // ================= FETCH PRODUCTS =================

            const productResponses = await Promise.all(

                productIds.map(async (productId) => {

                    try {

                        const response =
                            await axiosInstance.get(
                                `${API_ENDPOINTS.PRODUCT.DETAIL}?id=${productId}`
                            );


                        console.log(
                            `Product ${productId} Response:`,
                            response.data
                        );


                        if (response.data.success) {

                            const product =
                                response.data.product;


                            if (product) {

                                return {

                                    ...product,

                                    // VERY IMPORTANT
                                    // Keep cart key as productId

                                    cartProductId: productId,

                                    quantity:
                                        currentCartItems[
                                            productId
                                        ]?.quantity || 1

                                };

                            }

                        }


                        return null;


                    } catch (error) {

                        console.log(
                            `Error fetching product ${productId}:`,
                            error
                        );


                        return null;

                    }

                })

            );


            const cartProductsData =
                productResponses.filter(
                    (product) => product !== null
                );


            console.log(
                "Final Cart Products:",
                cartProductsData
            );


            setCartProducts(cartProductsData);


        } catch (error) {

            console.log(
                "Fetch Cart Error:",
                error
            );


            if (error.response?.status === 401) {

                toast.error(
                    "Please login to view cart"
                );

                navigate("/user");

            } else {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load cart"
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FETCH ADDRESSES
    // =========================================================

    const fetchAddresses = async () => {

        try {

            const response =
                await axiosInstance.get(
                    "/api/address/get"
                );


            console.log(
                "Address Response:",
                response.data
            );


            if (response.data.success) {

                const addressList =
                    response.data.addresses || [];


                setAddresses(addressList);


                // Select first address by default

                if (addressList.length > 0) {

                    setSelectedAddress(
                        addressList[0]
                    );

                }

            } else {

                setAddresses([]);

            }


        } catch (error) {

            console.log(
                "Fetch Address Error:",
                error
            );


            if (error.response?.status === 401) {

                toast.error(
                    "Please login to view addresses"
                );

                navigate("/user");

            } else {

                console.log(
                    error.response?.data?.message ||
                    "Failed to load addresses"
                );

            }

        }

    };


    // =========================================================
    // LOAD CART + ADDRESS
    // =========================================================

    useEffect(() => {

        fetchCart();

        fetchAddresses();

    }, []);


    // =========================================================
    // UPDATE CART
    // =========================================================

    const updateCart = async (
        productId,
        newQuantity
    ) => {

        if (!userId) {

            toast.error(
                "Please login to update cart"
            );

            return false;

        }


        try {

            setUpdatingProductId(productId);


            // =================================================
            // CREATE UPDATED CART
            // =================================================

            let updatedCartItems = {
                ...cartItems
            };


            // =================================================
            // IF QUANTITY IS 0
            // REMOVE PRODUCT COMPLETELY FROM CART
            // =================================================

            if (newQuantity <= 0) {

                delete updatedCartItems[productId];

            } else {

                updatedCartItems[productId] = {
                    quantity: newQuantity
                };

            }


            console.log(
                "Updating cart:",
                updatedCartItems
            );


            // =================================================
            // UPDATE BACKEND
            // =================================================

            const response =
                await axiosInstance.post(
                    API_ENDPOINTS.CART.UPDATE,
                    {
                        userId: userId,

                        cartItems: updatedCartItems
                    }
                );


            console.log(
                "Update Cart Response:",
                response.data
            );


            if (!response.data.success) {

                toast.error(
                    response.data.message ||
                    "Failed to update cart"
                );

                return false;

            }


            // =================================================
            // UPDATE LOCAL CART
            // =================================================

            setCartItems(updatedCartItems);


            // =================================================
            // UPDATE CART PRODUCTS
            // =================================================

            setCartProducts((previousProducts) => {

                // If quantity becomes 0,
                // remove product from UI completely

                if (newQuantity <= 0) {

                    return previousProducts.filter(
                        (product) =>
                            String(product.cartProductId) !==
                            String(productId)
                    );

                }


                // Otherwise update only clicked product

                return previousProducts.map(
                    (product) => {

                        if (
                            String(product.cartProductId)
                            ===
                            String(productId)
                        ) {

                            return {

                                ...product,

                                quantity:
                                    newQuantity

                            };

                        }


                        return product;

                    }
                );

            });


            return true;


        } catch (error) {

            console.log(
                "Update Cart Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to update cart"
            );


            return false;


        } finally {

            setUpdatingProductId(null);

        }

    };


    // =========================================================
    // REMOVE CART ITEM
    // =========================================================

    const removeCartItem = async (productId) => {

        if (!userId) {

            toast.error(
                "Please login to remove item from cart"
            );

            return;

        }

        try {

            setUpdatingProductId(productId);

            const response =
                await axiosInstance.delete(
                    `${API_ENDPOINTS.CART.REMOVE}?userId=${userId}&productId=${productId}`
                );

            console.log(
                "Remove Cart Item Response:",
                response.data
            );

            if (!response.data.success) {

                toast.error(
                    response.data.message ||
                    "Failed to remove item from cart"
                );

                return;

            }

            setCartItems((previousItems) => {

                const updatedItems = {
                    ...previousItems
                };

                delete updatedItems[productId];

                return updatedItems;

            });

            setCartProducts((previousProducts) =>
                previousProducts.filter(
                    (product) =>
                        String(product.cartProductId) !==
                        String(productId)
                )
            );

        } catch (error) {

            console.log(
                "Remove Cart Item Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to remove item from cart"
            );

        } finally {

            setUpdatingProductId(null);

        }

    };


    // =========================================================
    // INCREASE QUANTITY
    // =========================================================

    const increaseQuantity = async (productId) => {

        const currentQuantity =
            cartItems[productId]?.quantity || 1;


        const newQuantity =
            currentQuantity + 1;


        await updateCart(
            productId,
            newQuantity
        );

    };


    // =========================================================
    // DECREASE QUANTITY
    // =========================================================

// =========================================================
// DECREASE QUANTITY
// =========================================================

const decreaseQuantity = async (productId) => {

    const currentQuantity =
        cartItems[productId]?.quantity ?? 1;


    // =================================================
    // IF QUANTITY IS 1
    // REMOVE PRODUCT COMPLETELY FROM CART
    // =================================================

    if (currentQuantity === 1) {

        if (!userId) {

            toast.error(
                "Please login to update cart"
            );

            return;
        }


        try {

            setUpdatingProductId(productId);


            // =================================================
            // REMOVE FROM BACKEND
            // =================================================

            const response =
                await axiosInstance.delete(
                    API_ENDPOINTS.CART.REMOVE,
                    {
                        params: {
                            userId: userId,
                            productId: productId
                        }
                    }
                );


            console.log(
                "Remove Cart Item Response:",
                response.data
            );


            if (!response.data.success) {

                toast.error(
                    response.data.message ||
                    "Failed to remove item"
                );

                return;
            }


            // =================================================
            // REMOVE FROM LOCAL CART
            // =================================================

            const updatedCartItems = {
                ...cartItems
            };

            delete updatedCartItems[productId];

            setCartItems(
                updatedCartItems
            );


            // =================================================
            // REMOVE FROM CART PRODUCTS
            // =================================================

            setCartProducts(
                (previousProducts) =>
                    previousProducts.filter(
                        (product) =>
                            String(
                                product.cartProductId
                            ) !==
                            String(productId)
                    )
            );


        } catch (error) {

            console.log(
                "Remove Cart Item Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to remove item"
            );


        } finally {

            setUpdatingProductId(null);

        }

        return;
    }


    // =================================================
    // NORMAL DECREASE
    // =================================================

    const newQuantity =
        currentQuantity - 1;


    await updateCart(
        productId,
        newQuantity
    );

};


    // =========================================================
    // SELECT ADDRESS
    // =========================================================

    const handleSelectAddress = (address) => {

        setSelectedAddress(address);

        setShowAddressPopup(false);

    };


    // =========================================================
    // FORMAT ADDRESS
    // =========================================================

    const formatAddress = (address) => {

        if (!address) {

            return "No address found";

        }


        return `${address.street}, ${address.city}, ${address.state} - ${address.zipcode}`;

    };


    // =========================================================
    // TOTAL ITEMS
    // =========================================================

    const totalItems = cartProducts.reduce(

        (total, product) => {

            return total + product.quantity;

        },

        0

    );


    // =========================================================
    // SUBTOTAL
    // =========================================================

    const subtotal = cartProducts.reduce(

        (total, product) => {

            const price =
                Number(product.offerPrice) || 0;


            return (
                total +
                price * product.quantity
            );

        },

        0

    );


    // =========================================================
    // TAX
    // =========================================================

    const tax =
        Math.round(subtotal * 0.02);


    // =========================================================
    // TOTAL
    // =========================================================

    const totalAmount =
        subtotal + tax;


    // =========================================================
    // CREATE ORDER ITEMS
    // =========================================================

    const createOrderItems = () => {

        return cartProducts.map((product) => {

            return {

                product:
                    product.cartProductId,

                quantity:
                    product.quantity

            };

        });

    };


    // =========================================================
    // PLACE COD ORDER
    // =========================================================

    const placeCODOrder = async () => {

        try {

            setPlaceOrderLoading(true);


            if (!userId) {

                toast.error(
                    "Please login first"
                );

                navigate("/user");

                return;

            }


            if (!selectedAddress) {

                toast.error(
                    "Please select a delivery address"
                );

                setShowAddressPopup(true);

                return;

            }


            if (cartProducts.length === 0) {

                toast.error(
                    "Your cart is empty"
                );

                return;

            }


            const orderData = {

                userId: userId,

                address:
                    selectedAddress.id,

                items:
                    createOrderItems()

            };


            console.log(
                "COD Order Data:",
                orderData
            );


            const response =
                await axiosInstance.post(
                    "/api/order/cod",
                    orderData
                );


            console.log(
                "COD Order Response:",
                response.data
            );


            if (response.data.success) {

                toast.success(
                    "Order placed successfully!"
                );


                navigate("/my-orders");

            } else {

                toast.error(
                    response.data.message ||
                    "Failed to place order"
                );

            }


        } catch (error) {

            console.log(
                "COD Order Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to place order"
            );


        } finally {

            setPlaceOrderLoading(false);

        }

    };


    // =========================================================
    // PLACE RAZORPAY ORDER
    // =========================================================

    const placeRazorpayOrder = async () => {

        try {

            setPlaceOrderLoading(true);


            if (!userId) {

                toast.error(
                    "Please login first"
                );

                navigate("/user");

                return;

            }


            if (!selectedAddress) {

                toast.error(
                    "Please select a delivery address"
                );

                setShowAddressPopup(true);

                return;

            }


            if (cartProducts.length === 0) {

                toast.error(
                    "Your cart is empty"
                );

                return;

            }


            // ================= ORDER DATA =================

            const orderData = {

                userId: userId,

                address:
                    selectedAddress.id,

                items:
                    createOrderItems()

            };


            console.log(
                "Razorpay Order Data:",
                orderData
            );


            // ================= CREATE RAZORPAY ORDER =================

            const response =
                await axiosInstance.post(
                    "/api/order/razorpay",
                    orderData
                );


            console.log(
                "Razorpay Order Response:",
                response.data
            );


            const data =
                response.data;


            if (!data.success) {

                toast.error(
                    data.message ||
                    "Unable to create Razorpay order"
                );

                return;

            }


            // =====================================================
            // IMPORTANT
            //
            // Your backend response fields are swapped.
            //
            // data.orderId
            //     = actual Razorpay order ID
            //
            // data.razorpayOrderId
            //     = MongoDB order ID
            // =====================================================

            if (!window.Razorpay) {

                toast.error(
                    "Razorpay is not loaded. Please refresh the page."
                );

                return;

            }


            // ================= RAZORPAY OPTIONS =================

            const options = {

                key:
                    data.keyId,

                amount:
                    data.amount * 100,

                currency:
                    data.currency,

                name:
                    "GrocerWiseQ",

                description:
                    "Grocery Order",

                order_id:
                    data.orderId,


                prefill: {

                    name:
                        `${selectedAddress.firstName || ""} ${selectedAddress.lastName || ""}`.trim(),

                    email:
                        selectedAddress.email || "",

                    contact:
                        selectedAddress.phone || ""

                },


                theme: {

                    color:
                        "#29a866"

                },


                // ================= PAYMENT SUCCESS =================

                handler: async function (
                    paymentResponse
                ) {

                    try {

                        console.log(
                            "Razorpay Payment Response:",
                            paymentResponse
                        );


                        // ================= VERIFY PAYMENT =================

const verifyResponse =
    await axiosInstance.post(
        "/api/order/verify-payment",
        {

            userId: userId,

            address: selectedAddress.id,

            items: createOrderItems(),


            razorpayPaymentId:
                paymentResponse.razorpay_payment_id,

            razorpayOrderId:
                data.orderId,

            razorpaySignature:
                paymentResponse.razorpay_signature

        }
    );


console.log(
    "Payment Verification Response:",
    verifyResponse.data
);


if (
    verifyResponse.data.success
) {

    toast.success(
        "Payment successful!"
    );

    navigate("/my-orders");

} else {

    toast.error(
        verifyResponse.data.message ||
        "Payment verification failed"
    );

}


                    } catch (error) {

                        console.log(
                            "Payment Verification Error:",
                            error
                        );


                        toast.error(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );

                    }

                }

            };


            // ================= OPEN RAZORPAY =================

            const razorpay =
                new window.Razorpay(options);


            // ================= PAYMENT FAILED =================

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.log(
                        "Razorpay Payment Failed:",
                        response
                    );


                    toast.error(
                        response.error?.description ||
                        "Payment failed"
                    );

                }
            );


            razorpay.open();


        } catch (error) {

            console.log(
                "Razorpay Order Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to start Razorpay payment"
            );


        } finally {

            setPlaceOrderLoading(false);

        }

    };


    // =========================================================
    // PLACE ORDER
    // =========================================================

    const handlePlaceOrder = async () => {

        if (placeOrderLoading) {

            return;

        }


        if (paymentMethod === "cod") {

            await placeCODOrder();

        } else {

            await placeRazorpayOrder();

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="cart-page">

                <div className="cart-container">

                    <div className="cart-left">

                        <h1>
                            Shopping Cart
                        </h1>

                        <p>
                            Loading cart...
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="cart-page">


            {/* ================= CART CONTENT ================= */}

            <div className="cart-container">


                {/* ================= LEFT ================= */}

                <div className="cart-left">


                    <h1>

                        Shopping Cart

                        <span>

                            {totalItems} item
                            {totalItems !== 1 ? "s" : ""}

                        </span>

                    </h1>


                    {/* ================= TABLE HEADER ================= */}

                    <div className="cart-header">

                        <p>
                            Product Details
                        </p>

                        <p>
                            Subtotal
                        </p>

                        <p>
                            Remove
                        </p>

                    </div>


                    {/* ================= PRODUCTS ================= */}

                    {cartProducts.length === 0 ? (

                        <div className="empty-cart">

                            <h2>
                                Your cart is empty
                            </h2>

                            <p>
                                Add some products to your cart.
                            </p>

                        </div>

                    ) : (

                        cartProducts.map((product) => {

                            const productId =
                                product.cartProductId;


                            const isUpdating =
                                updatingProductId === productId;


                            return (

                                <div
                                    className="cart-product"
                                    key={productId}
                                >


                                    {/* ================= PRODUCT ================= */}

                                    <div className="cart-product-details">

                                        <img
                                            src={product.image?.[0]}
                                            alt={product.name}
                                        />


                                        <div>

                                            <h3>
                                                {product.name}
                                            </h3>


                                            <p>
                                                Category: {product.category}
                                            </p>


                                            <p>
                                                Qty: {product.quantity}
                                            </p>


                                            {/* ================= QUANTITY ================= */}

                                            <div className="cart-quantity">


                                                {/* MINUS */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decreaseQuantity(
                                                            productId
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating
                                                    }
                                                >

                                                    −

                                                </button>


                                                {/* NUMBER */}

                                                <span>
                                                    {product.quantity}
                                                </span>


                                                {/* PLUS */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increaseQuantity(
                                                            productId
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdating
                                                    }
                                                >

                                                    +

                                                </button>


                                            </div>


                                        </div>


                                    </div>


                                    {/* ================= PRICE ================= */}

                                    <div className="cart-product-price">

                                        ₹

                                        {(
                                            (
                                                Number(
                                                    product.offerPrice
                                                ) || 0
                                            )
                                            *
                                            product.quantity

                                        ).toFixed(0)}

                                    </div>


                                    {/* ================= REMOVE ================= */}

                                    <button
                                        className="remove-button"
                                        type="button"
                                        onClick={() =>
                                            removeCartItem(
                                                productId
                                            )
                                        }
                                        disabled={
                                            isUpdating
                                        }
                                    >

                                        ×

                                    </button>


                                </div>

                            );

                        })

                    )}


                    {/* ================= CONTINUE ================= */}

                    <a
                        href="/products"
                        className="continue-shopping"
                    >

                        ← Continue Shopping

                    </a>


                </div>


                {/* ================= RIGHT ================= */}

                <div className="order-summary">


                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-divider"></div>


                    {/* ================= ADDRESS ================= */}

                    <div className="delivery-address">

                        <h4>
                            DELIVERY ADDRESS
                        </h4>


                        <div className="address-row">

                            <p>

                                {selectedAddress
                                    ? formatAddress(
                                        selectedAddress
                                    )
                                    : "No address found"}

                            </p>


                            <button
                                onClick={() =>
                                    setShowAddressPopup(true)
                                }
                            >

                                Change

                            </button>


                        </div>


                    </div>


                    {/* ================= PAYMENT ================= */}

                    <div className="payment-section">

                        <h4>
                            PAYMENT METHOD
                        </h4>


                        <select
                            value={paymentMethod}
                            onChange={(event) =>
                                setPaymentMethod(
                                    event.target.value
                                )
                            }
                        >

                            <option value="cod">
                                Cash On Delivery
                            </option>


                            <option value="razorpay">
                                Razorpay
                            </option>

                        </select>


                    </div>


                    <div className="summary-divider"></div>


                    {/* ================= PRICE ================= */}

                    <div className="summary-row">

                        <p>
                            Price
                        </p>

                        <span>
                            ₹{subtotal.toFixed(0)}
                        </span>

                    </div>


                    {/* ================= SHIPPING ================= */}

                    <div className="summary-row">

                        <p>
                            Shipping Fee
                        </p>

                        <span className="free">
                            Free
                        </span>

                    </div>


                    {/* ================= TAX ================= */}

                    <div className="summary-row">

                        <p>
                            Tax (2%)
                        </p>

                        <span>
                            ₹{tax.toFixed(0)}
                        </span>

                    </div>


                    {/* ================= TOTAL ================= */}

                    <div className="summary-row total-row">

                        <p>
                            Total Amount:
                        </p>

                        <span>
                            ₹{totalAmount.toFixed(0)}
                        </span>

                    </div>


                    {/* ================= PLACE ORDER ================= */}

                    <button
                        className="place-order-button"
                        disabled={
                            cartProducts.length === 0 ||
                            placeOrderLoading
                        }
                        onClick={handlePlaceOrder}
                    >

                        {placeOrderLoading
                            ? "Processing..."
                            : "Place Order"}

                    </button>


                </div>


            </div>


            {/* ================= FOOTER ================= */}

            <footer className="cart-footer">

                <div className="cart-footer-content">

                    <h2>
                        🛒 Quickbasket
                    </h2>


                    <p>

                        We deliver fresh groceries and snacks
                        straight to your door. Trusted by
                        thousands, we aim to make your
                        shopping experience simple and affordable.

                    </p>

                </div>

            </footer>


            {/* ================= ADDRESS POPUP ================= */}

            {showAddressPopup && (

                <div
                    className="address-popup-overlay"
                    onClick={() =>
                        setShowAddressPopup(false)
                    }
                >


                    <div
                        className="address-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        {/* CLOSE */}

                        <button
                            className="address-popup-close"
                            onClick={() =>
                                setShowAddressPopup(false)
                            }
                        >

                            ×

                        </button>


                        <h2>
                            Delivery Address
                        </h2>


                        {/* ================= SAVED ADDRESSES ================= */}

                        {addresses.length === 0 ? (

                            <>

                                <p>
                                    No saved address found.
                                </p>

                            </>

                        ) : (

                            <div className="saved-addresses">

                                {addresses.map((address) => (

                                    <div
                                        key={address.id}
                                        className={
                                            `saved-address ${
                                                selectedAddress?.id === address.id
                                                    ? "selected-address"
                                                    : ""
                                            }`
                                        }
                                        onClick={() =>
                                            handleSelectAddress(
                                                address
                                            )
                                        }
                                    >

                                        <strong>

                                            {address.firstName}{" "}

                                            {address.lastName}

                                        </strong>


                                        <p>
                                            {address.street}
                                        </p>


                                        <p>

                                            {address.city},{" "}

                                            {address.state} -{" "}

                                            {address.zipcode}

                                        </p>


                                        <p>
                                            {address.country}
                                        </p>


                                        <p>
                                            📞 {address.phone}
                                        </p>


                                    </div>

                                ))}

                            </div>

                        )}


                        {/* ================= ADD ADDRESS ================= */}

                        <button
                            className="add-address-popup-button"
                            onClick={() =>
                                navigate("/add-address")
                            }
                        >

                            Add Address

                        </button>


                    </div>


                </div>

            )}


        </div>

    );

}

export default Cart;