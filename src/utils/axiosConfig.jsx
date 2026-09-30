import axios from "axios";

const axiosInstance = axios.create({

    baseURL: "https://groceryapp-backend-1.onrender.com",

    withCredentials: true

});

export default axiosInstance;