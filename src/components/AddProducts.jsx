import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./AddProducts.css";

import axiosInstance from "../utils/axiosConfig";
import API_ENDPOINTS from "../utils/apiEndpoints";


function AddProduct() {

    const navigate = useNavigate();


    // ================= STATES =================

    const [images, setImages] = useState([
        null,
        null,
        null,
        null
    ]);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");

    const [loading, setLoading] = useState(false);


    // ================= IMAGE UPLOAD =================

    const handleImageChange = (index, event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const imageURL = URL.createObjectURL(file);

        const updatedImages = [...images];

        updatedImages[index] = {
            file: file,
            preview: imageURL
        };

        setImages(updatedImages);
    };


    // ================= ADD PRODUCT =================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // ================= VALIDATION =================

        if (!productName.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Product description is required");
            return;
        }

        if (!category) {
            toast.error("Please select a category");
            return;
        }

        if (!productPrice || Number(productPrice) <= 0) {
            toast.error("Enter a valid product price");
            return;
        }

        if (!offerPrice || Number(offerPrice) <= 0) {
            toast.error("Enter a valid offer price");
            return;
        }


        const selectedImages = images.filter(
            (image) => image !== null
        );


        if (selectedImages.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }


        setLoading(true);


        try {

            // ================= PRODUCT DATA =================

            const productData = {

                name: productName,

                description: [
                    description
                ],

                price: Number(productPrice),

                offerPrice: Number(offerPrice),

                category: category

            };


            // ================= FORMDATA =================

            const formData = new FormData();

            formData.append(
                "productData",
                JSON.stringify(productData)
            );


            selectedImages.forEach((image) => {

                formData.append(
                    "images",
                    image.file
                );

            });


            // ================= API CALL =================

            const response = await axiosInstance.post(
                API_ENDPOINTS.PRODUCT.ADD,
                formData
            );


            console.log(
                "Add Product Response:",
                response.data
            );


            // ================= SUCCESS =================

            if (response.data.success) {

                toast.success(
                    response.data.message ||
                    "Product added successfully!"
                );


                // Go to product list
                navigate("/sellerdashboard/product-list");

            }

        } catch (error) {

            console.log(
                "Add Product Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Failed to add product";


            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="add-product">

            <div className="add-product-container">

                <h2>
                    Add Product
                </h2>


                <form onSubmit={handleSubmit}>


                    {/* ================= PRODUCT IMAGES ================= */}

                    <div className="add-product-field">

                        <label>
                            Product Image
                        </label>

                        <div className="product-image-upload">

                            {images.map((image, index) => (

                                <label
                                    className="image-upload-box"
                                    key={index}
                                >

                                    {image ? (

                                        <img
                                            src={image.preview}
                                            alt={`Product ${index + 1}`}
                                        />

                                    ) : (

                                        <div className="upload-placeholder">

                                            <span className="upload-icon">
                                                ↑
                                            </span>

                                            <span>
                                                Upload
                                            </span>

                                        </div>

                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) =>
                                            handleImageChange(
                                                index,
                                                event
                                            )
                                        }
                                    />

                                </label>

                            ))}

                        </div>

                    </div>


                    {/* ================= PRODUCT NAME ================= */}

                    <div className="add-product-field">

                        <label htmlFor="productName">
                            Product Name
                        </label>

                        <input
                            type="text"
                            id="productName"
                            placeholder="Type here"
                            value={productName}
                            onChange={(event) =>
                                setProductName(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* ================= DESCRIPTION ================= */}

                    <div className="add-product-field">

                        <label htmlFor="description">
                            Product Description
                        </label>

                        <textarea
                            id="description"
                            placeholder="Type here"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* ================= CATEGORY ================= */}

                    <div className="add-product-field">

                        <label htmlFor="category">
                            Category
                        </label>

                        <select
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Category
                            </option>

                            <option value="Organic Veggies">
                                Organic Veggies
                            </option>

                            <option value="Fresh Fruits">
                                Fresh Fruits
                            </option>

                            <option value="Cold Drinks">
                                Cold Drinks
                            </option>

                            <option value="Instant Foods">
                                Instant Foods
                            </option>

                            <option value="Dairy Products">
                                Dairy Products
                            </option>

                            <option value="Bakery & Breads">
                                Bakery & Breads
                            </option>

                            <option value="Grains & Cereals">
                                Grains & Cereals
                            </option>

                        </select>

                    </div>


                    {/* ================= PRICE SECTION ================= */}

                    <div className="price-row">

                        <div className="price-field">

                            <label htmlFor="productPrice">
                                Product Price
                            </label>

                            <input
                                type="number"
                                id="productPrice"
                                placeholder="0"
                                min="0"
                                value={productPrice}
                                onChange={(event) =>
                                    setProductPrice(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="price-field">

                            <label htmlFor="offerPrice">
                                Offer Price
                            </label>

                            <input
                                type="number"
                                id="offerPrice"
                                placeholder="0"
                                min="0"
                                value={offerPrice}
                                onChange={(event) =>
                                    setOfferPrice(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* ================= ADD BUTTON ================= */}

                    <button
                        type="submit"
                        className="add-product-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            "ADD"
                        )}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;