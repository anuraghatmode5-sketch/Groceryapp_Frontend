const API_ENDPOINTS = {

    // ================= USER =================

    USER: {

        REGISTER: "/api/users/register",

        LOGIN: "/api/user/login",

        IS_AUTH: "/api/user/is-auth",

        LOGOUT: "/api/user/logout"


    },


    // ================= SELLER =================

    SELLER: {

        LOGIN: "/api/seller/login",

        IS_AUTH: "/api/seller/is-auth",

        LOGOUT: "/api/seller/logout"

    },


    // ================= ADDRESS =================

    ADDRESS: {

        ADD: "/api/address/add",

        GET: "/api/address/get"

    },


    // ================= CART =================

    CART: {

        UPDATE: "/api/cart/update",
        REMOVE: "/api/cart/remove"

    },


    // ================= ORDER =================

    ORDER: {

        COD: "/api/order/cod",

        USER_ORDERS: "/api/order/user",

        VERIFY_PAYMENT: "/api/order/verify-payment",

        ALL: "/api/order/all"

    },


    // ================= PRODUCT =================

// ================= PRODUCT =================

PRODUCT: {

    LIST: "/api/product/list",

    ADD: "/api/product/add",

    STOCK: "/api/product/stock",

    ORDERS: "/api/product/orders",

    DETAIL: "/api/product/id"

}

};


export default API_ENDPOINTS;