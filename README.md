# GroceryApp — Frontend

A full-stack grocery e-commerce application frontend built with React.js. It provides a shopping interface for users and a separate workflow for sellers to manage grocery products.

The frontend communicates with a Spring Boot backend to support authentication, product browsing, cart management, address management, order placement, and online payments.

## ✨ Features

- **Product Browsing:** View available grocery products and product details.
- **Shopping Cart:** Add products to the cart, update quantities, and remove items.
- **User Authentication:** Register, log in, and manage user authentication.
- **Seller Workflow:** Access seller functionality for product management.
- **Address Management:** Add and retrieve delivery addresses.
- **Order Management:** Place Cash on Delivery orders and view order information.
- **Online Payments:** Integrate Razorpay for online payment checkout.
- **Responsive Interface:** User-friendly interface for grocery shopping.
- **Backend Integration:** Communicate with REST APIs to retrieve and update application data.

## 🛠️ Tech Stack

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Axios
- React Router

## 🔗 Related Repository

**Backend:** [GroceryApp Backend](https://github.com/anuraghatmode5-sketch/Groceryapp_Backend)

The backend uses Java, Spring Boot, Spring Security, JWT authentication, MongoDB, Cloudinary, and Razorpay.

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/anuraghatmode5-sketch/Groceryapp_Frontend.git
cd Groceryapp_Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API

Ensure the Spring Boot backend is running and configure the frontend API base URL to point to it.

For local development, use your local backend URL. For production, use your deployed backend URL.

Check the project's API configuration files for the exact setting used by this application.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal to access the application.

### 5. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔌 Backend Integration

The frontend communicates with backend REST APIs for:

- User and seller authentication
- Product listings and management
- Cart operations
- Delivery address management
- Order placement and retrieval
- Razorpay payment processing

## 🚀 Live Demo

https://groceryapp-frontend.netlify.app/

## 👨‍💻 Author

**Anurag Gajanan Hatmode**

GitHub: [@anuraghatmode5-sketch](https://github.com/anuraghatmode5-sketch)

---

Built with React.js as part of a full-stack grocery e-commerce project.
