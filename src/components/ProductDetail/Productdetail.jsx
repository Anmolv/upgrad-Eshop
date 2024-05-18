import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TextField, FormControl, Stack, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import './ProductDetail.css';
import Navbar from '../../common/navbar/NavBar';
import Api from '../../common/Api';

function ProductDetail() {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { productOrderQuantity } = location.state || 1;
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productPrice, setProductPrice] = useState(0.0);
    const [productDescription, setProductDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [quantity, setQuantity] = useState(null);
    const [categories, setCategories] = useState(['All']);
    const [isQuantityEntered, setIsQuantityEntered] = useState(false);
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
        setProductId(id);
        setQuantity(productOrderQuantity);
        setIsQuantityEntered(productOrderQuantity > 0 );
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
            const enteredQuantity = parseInt(quantity, 10);
            if (enteredQuantity < 1) {
                setQuantityError("Quantity cannot be 0 or negative");
            } else if (enteredQuantity > availableQuantity) {
                setQuantityError("Quantity greater than Available Quantity: " + availableQuantity);
            } else {
                navigate('/orders', { state: { product: { id: productId, name: productName, quantity: quantity, description: productDescription, category: productCategory, price: productPrice } } });
            }
        } else {
            setQuantityError("Enter quantity to order");
        }
    };

    return (
        <div className="product-detail-container">
            <Navbar />
            <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} sx={{ marginTop: '10px' }}>
                <ToggleButtonGroup sx={{ justifyContent: 'center' }}>
                    {categories.map((category) => (
                        <ToggleButton key={category} value={category}>
                            {category}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Stack direction="row">
                    <div>
                        <img src={imageUrl} alt={productName} className="product-image" />
                    </div>
                    <div className="product-details">
                        <div className="info-container">
                            <h2>{productName}</h2>
                            <div className="quantity-box">Available Quantity: {availableQuantity}</div>
                        </div>
                        <label>Category: <b>{productCategory}</b></label>
                        <p><i>{productDescription}</i></p>
                        <p className="price">₹ {productPrice}</p>
                        <FormControl fullWidth>
                            <TextField
                                id="quantity"
                                label="Enter Quantity"
                                name="quantity"
                                type="number"
                                style={{ width: '350px' }}
                                value={quantity}
                                onChange={handleQuantityChange}
                                error={!!quantityError} helperText={quantityError}
                                required

                            />
                            <Button id="order-btn" onClick={handlePlaceOrder} disabled={!isQuantityEntered} variant='contained'>PLACE ORDER</Button>
                        </FormControl>
                    </div>
                </Stack>
            </Stack>
        </div>
    );
}
export default ProductDetail;