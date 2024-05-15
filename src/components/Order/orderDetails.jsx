import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, Menu, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton } from '@mui/material';
import { Edit, Delete, Label } from '@mui/icons-material';
import './orderdetail.css';
import { Stepper, Step, StepLabel } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { useProduct } from '../../common/ProductContext';
import Navbar from '../../common/navbar/NavBar';
import axios from 'axios';
import { SuccessToast, ErrorToast } from "../../common/Toasts/Toasts";

function OrderDetails({ onSaveAddress, addresses }) {
   // const { authState } = useAuth();
    const navigate = useNavigate();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [showNotification, setShowNotification] = useState(false); 
    const { productState, setProducts } = useProduct();
    const [filteredProducts, setFilteredProducts] = useState(productState.products);
    const [addressDetails, setAddressDetails] = useState({});
    const [productDetails, setProductDetails] = useState({});


    const searchProducts = (searchQuery) => {
      const filtered = productState.products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
  };
  
 
    const handleNotification = () => {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000); // Hide notification after 2 seconds
      };
    
      const handlePlaceOrder = () => {
        // Perform order placement logic here
        handleNotification(); // Show notification
       // navigate('/products'); // Navigate to confirmation page
      };



      const closeNotification = () => {
        setShowNotification(false);
      };


    const steps = ['Items', 'Select Address', 'Confirm Order'];
    

    const { authState } = useAuth();
    const activeStep = 2;

   useEffect(() => {
    /*  const fetchProductDetails = async () => {
          try {
              const response = await axios.get('http://localhost:8080/api/products');
              setProductDetails(response.data);
          } catch (error) {
              console.error('Error fetching product details:', error);
          }
      };
*/
      const fetchAddressDetails = async () => {
          try {
              const response = await axios.get('http://localhost:8080/api/addresses');
              setAddressDetails(response.data);
          } catch (error) {
              console.error('Error fetching address details:', error);
          }
      };

      //fetchProductDetails();
      fetchAddressDetails();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
 
    axios
      .get("http://localhost:8080/api/products", {
        headers: {
          'x-auth-token' : authState.access_token,
        },
      })
      .then(function (response) {
        setProductDetails(response.data);
      })
      .catch(function () {
        ErrorToast("Error: There was an issue in retrieving categories list.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);







    return (

        <div>
              <Navbar onSearch={searchProducts} />
        <Stack alignItems='center'>

<br></br>
<br></br>
<div style={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
 
      
    </div>
    <br>
    </br>
    <div className="order-details">
      <table className="details-table">
        <tr>
          <td className="left-column">
            <div className="left-section"> 
              <h2><b>Shoe</b></h2>
              <p>Quantity: 1</p>
              <p>Category: Footwear</p>
              <p>wndr-13 sports shoes for men | Latest Stylish Casual sport shoes for men running shoes for boys | Lace up Lightweight grey shoes for running, walking, gym, trekking, hiking & party</p>
              <p style={{ color: 'red' }}>Total Price: ₹1000</p>
            </div>
          </td>
          <td className="vertical-line"></td> {/* Vertical line */}
          <td className="right-column">
            <div className="right-section">
            <h2><b>Address Details:</b></h2>
              <p>Lucknow Home</p>
              <p>Contact Number: 7903710346</p>
              <p>Police Line, Lucknow </p>
              <p>Uttar Pradesh</p>
              <p>723990</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
      <div className="button-section">
        <button className="back-button" onClick={() => navigate('/addresses')}>BACK</button>
        <button className="place-order-button" onClick={handlePlaceOrder}>PLACE ORDER</button>
       
        </div>
      

        </Stack>

       
        {/* Notification component */}
        {showNotification && (
          <div className="notification" style={{ backgroundColor: 'green', color: 'white', padding: '10px', width: '300px', height: '50px', position: 'fixed', top: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Order placed successfully!</span>
            <button onClick={closeNotification} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>✕</button>
          </div>
        )}
</div>
        
        
    );

                }
    



export default OrderDetails;