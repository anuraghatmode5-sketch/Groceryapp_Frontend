import { Outlet } from "react-router-dom";

import SellerNavbar from "../components/SellerNavbar";
import SellerSidebar from "../components/SellerSidebar";

import "./SellerDashboard.css";


function SellerDashboard() {

    return (

        <div className="seller-dashboard">

            {/* Seller Navbar */}
            <SellerNavbar />


            {/* Dashboard Body */}
            <div className="seller-dashboard-body">

                {/* Sidebar */}
                <SellerSidebar />


                {/* Main Content */}
                <main className="seller-main-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );
}


export default SellerDashboard;