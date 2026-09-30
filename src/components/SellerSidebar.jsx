import { useNavigate, useLocation } from "react-router-dom";
import "./SellerSidebar.css";

function SellerSidebar() {

    const navigate = useNavigate();
    const location = useLocation();


    return (

        <aside className="seller-sidebar">

            {/* Add Product */}
            <div
                className={`seller-sidebar-item ${
                    location.pathname === "/sellerdashboard"
                        ? "active"
                        : ""
                }`}
                onClick={() => navigate("/sellerdashboard")}
            >
                <span>⊞</span>
                <p>Add Product</p>
            </div>


            {/* Product List */}
            <div
                className={`seller-sidebar-item ${
                    location.pathname === "/sellerdashboard/product-list"
                        ? "active"
                        : ""
                }`}
                onClick={() =>
                    navigate("/sellerdashboard/product-list")
                }
            >
                <span>☷</span>
                <p>Product List</p>
            </div>


            {/* Orders */}
            <div
                className={`seller-sidebar-item ${
                    location.pathname === "/sellerdashboard/orders"
                        ? "active"
                        : ""
                }`}
                onClick={() =>
                    navigate("/sellerdashboard/orders")
                }
            >
                <span>▣</span>
                <p>Orders</p>
            </div>

        </aside>
    );
}

export default SellerSidebar;