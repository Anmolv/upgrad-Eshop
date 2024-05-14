import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material';
import './ProductDetail.css';
import Navbar from '../../common/navbar/NavBar';
import Api from '../../common/Api';


function Productdetail() {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState(0.0);
    const [productDescription, setProductDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [categories, setCategories] = useState(['All']);
    const [isQuantityEntered, setIsQuantityEntered] = useState(true);
    const [quantityError, setQuantityError] = useState('');

    const { id } = useParams();


    const getAllCategories = async () => {
        try {
            const response = await Api.get('/products/categories');
            if (response.status === 200) {
                setCategories(['All', ...response['data']]);
            } else if (response.status === 401) {
                alert(`Failed to fetch categories!`);
            }
        } catch (error) {
            alert(`Failed to fetch categories!`);
        }
    }




    const getProductData = async (id) => {
        try {
            const response = await Api.get(`/products/${id}`);
            if (response.status === 200) {
                setProductName(response["data"]["name"]);
                setAvailableQuantity(response["data"]["availableItems"]);
                setImageUrl(response["data"]["imageUrl"]);
                setProductCategory(response["data"]["category"]);
                setProductDescription(response["data"]["description"]);
                setProductPrice(response["data"]["price"]);
            } else if (response.status === 401) {
                alert(`Failed to fetch product data!`);
            }
        } catch (error) {
            alert(`Failed to fetch product data!`);
        }
    }

    useEffect(() => {
        getProductData(id);
        getAllCategories();
    }, []);


    useEffect(() => {
        if (!authState.isLoggedIn) {
            navigate("/login");
        }
    }, []);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
        setIsQuantityEntered(e.target.value.trim() !== '');
    };

    const handlePlaceOrder = () => {
        if (isQuantityEntered) {
            if (quantity < 1) {
                setQuantityError("Quanity cannot be 0 or negative");
            } else if (quantity > availableQuantity) {
                setQuantityError("Quantity greater than Available Quantity: "  + availableQuantity);
            } else {
                navigate('/addresses');
            }
        } else {
            setQuantityError("Enter quantity to order");
        }
    };

    return (
        <div>
            <Navbar />
            <Stack alignItems='center'>
                <ToggleButtonGroup sx={{ margin: '10px', justifyContent: 'center' }}>
                    {categories.map((category) => (
                        <ToggleButton key={category} value={category}>
                            {category}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                <br>
                </br>
                <br>
                </br>
                <br></br>

                {productName !== '' && (
                    <div className="product-container">
                        <img src={imageUrl} alt={productName} className="product-image" />
                        <div className="product-details">
                            <div className="info-container">
                                <h2>{productName}</h2>
                                <div className="quantity-box">Available Quantity: {availableQuantity}</div>
                            </div>
                            <p>Category: <b>{productCategory}</b></p>
                            <p><i>{productDescription}</i></p>
                            <p className="price">₹ {productPrice}</p>
                        </div>
                    </div>
                )}

                {productName !== '' && (<FormControl fullWidth>
                    <TextField
                        id="quantity"
                        label="Enter Quantity"
                        name="quantity"
                        type="number"
                        style={{ width: '30%', marginLeft: '650px' }}
                        value={quantity}
                        onChange={handleQuantityChange}
                        error={!!quantityError} helperText={quantityError}
                        required

                    />
                    <br />

                    <button className="order-btn" onClick={handlePlaceOrder} disabled={!isQuantityEntered}
                        style={{ width: '20%', marginLeft: '650px' }}

                    >PLACE ORDER</button>
                </FormControl>)}

            </Stack>
        </div>
    );
}
export default Productdetail;