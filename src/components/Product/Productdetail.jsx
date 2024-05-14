import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button,TextField, FormControl,IconButton, Grid, Menu, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import { useHistory } from 'react-router-dom';
import Navbar from '../../common/navbar/NavBar';
import { useProduct } from '../../common/ProductContext';


const categories = ['All', 'APPAREL', 'ELECTRONICS', 'FOOTWAER','PERSONAL CARE'];


function Productdetail() {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const { productState, setProducts } = useProduct();
    const [filteredProducts, setFilteredProducts] = useState(productState.products);
    const [quantity, setQuantity] = useState('');
    const [product, setProduct] = useState(null);

   


  const [isQuantityEntered, setIsQuantityEntered] = useState(false);


  useEffect(() => {
    // Fetch product details from the API
    fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(data => {
            // Assuming the API response is an array of products
            if (Array.isArray(data) && data.length > 0) {
                const firstProduct = data[0]; // Assuming you want details of the first product
                setProduct(firstProduct);
                setQuantity(String(firstProduct.availableItems)); // Convert to string to populate the text box
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            // Handle error, maybe show a message to the user
        });
}, []); // Empty dependency array to fetch data only once on component mount



  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value);
    setIsQuantityEntered(value.trim() !== '');
  };

  const handlePlaceOrder = () => {
    if (isQuantityEntered) {
      navigate('/addresses'); // Navigate to confirmation page if quantity is entered
    }
};


  const searchProducts = (searchQuery) => {
    const filtered = productState.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
};

  

    return (
      <div>     
       <Navbar onSearch={searchProducts} />
        <Stack alignItems='center'>
            
      

            <ToggleButtonGroup>
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
            
     
            {/* Your other JSX code */}
            {product && (
                <div className="product-container">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <div className="product-details">
                       
                            <div className="info-container">
                                <h2>{product.name}</h2>
                                <div className="quantity-box">Available Quantity: {product.availableItems}</div>
                            </div>
                            <p>Category: <b>{product.category}</b></p>
                            <p><i>{product.description}</i></p>
                            <p className="price">₹ {product.price}</p>
                        </div>
                    </div>
                   
                
            )}
            <FormControl fullWidth>
                <TextField
                    id="quantity"
                    label="Enter Quantity"
                    name="quantity"
                    type="number"
                    style={{ width: '30%', marginLeft: '650px' }} 
                    value={quantity}
                    onChange={handleQuantityChange}
                    required
                    
                />
                <br />
               
                <button className="order-btn" onClick={handlePlaceOrder} disabled={!isQuantityEntered}
                 style={{ width: '20%', marginLeft: '650px' }} 
                
                >PLACE ORDER</button>
           
            </FormControl>
            {/* Your other JSX code */}
           
        </Stack>
        </div>
        
        
    );

                }
    



export default Productdetail;