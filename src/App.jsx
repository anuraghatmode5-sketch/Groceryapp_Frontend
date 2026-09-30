import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import SellerLogin from "./pages/SellerLogin.jsx";
import AddProducts from "./components/AddProducts.jsx";
import SellerOrder from "./components/SellerOrder.jsx";
import ProductList from "./components/ProductList";
import SellerDashboard from "./pages/SellerDashboard";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";

import { Toaster } from "react-hot-toast";

import ProductDetail from "./pages/ProductDetail.jsx";
import Products from "./pages/Products.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import MyOrders from "./pages/MyOrders";


function App() {

    return (

        <BrowserRouter>

            <Toaster />

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= USER ================= */}

                <Route
                    path="/user"
                    element={<UserLogin />}
                />

                <Route
                    path="/user/signup"
                    element={<UserSignup />}
                />


                {/* ================= CART ================= */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />


                {/* ================= ADDRESS ================= */}

                <Route
                    path="/add-address"
                    element={<AddAddress />}
                />


                {/* ================= ALL PRODUCTS ================= */}

                <Route
                    path="/products"
                    element={<Products />}
                />


                {/* ================= CATEGORY PRODUCTS ================= */}

                <Route
                    path="/products/category/:category"
                    element={<CategoryProducts />}
                />


                {/* ================= PRODUCT DETAIL ================= */}

                <Route
                    path="/products/:category/:id"
                    element={<ProductDetail />}
                />


                {/* ================= SELLER LOGIN ================= */}

                <Route
                    path="/seller"
                    element={<SellerLogin />}
                />


                {/* ================= SELLER DASHBOARD ================= */}

                <Route
                    path="/sellerdashboard"
                    element={<SellerDashboard />}
                >

                    <Route
                        index
                        element={<AddProducts />}
                    />

                    <Route
                        path="product-list"
                        element={<ProductList />}
                    />

                    <Route
                        path="orders"
                        element={<SellerOrder />}
                    />

                </Route>

                <Route path="/my-orders" element={<MyOrders />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;