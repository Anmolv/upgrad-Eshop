import React, { useState, useEffect } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel, Button, Stack} from '@mui/material';
import Navbar from '../../common/navbar/NavBar';
import './Order.css';
import AddressForm from '../Address/AddressForm';
import ErrorToast, { SuccessToast } from '../../common/Toasts/Toasts';
import OrderPreview from '../OrderPreview/OrderPreview';
import Api from '../../common/Api';

function Order() {

    const location = useLocation();
    const navigate = useNavigate();
    const { authState } = useAuth();

    const { product } = location.state || {};
    const [selectedAddressId, setSelectAddressId] = useState('');
    const [selectedAddressLabel, setSelectedAddressLabel] = useState(null);
    const [address, setAddress] = useState();

    const [activeStep, setActiveStep] = useState(1);

    const validateAndMoveNext = () => {
        if (selectedAddressId === null || selectedAddressId === undefined || selectedAddressId.length === 0) {
            ErrorToast('Please select address!')
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleOnAddressSelect = (addressId, addressLabel) => {
        setSelectAddressId(addressId);
        setSelectedAddressLabel(addressLabel);
        getAddress(addressId)
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
          const response = await Api.post('/orders',
            {
                "quantity": product.quantity,
                "product" : product.id,
                "address" : selectedAddressId
            },
            {
              headers: {
                'x-auth-token': authState.access_token
              },
            });
    
          if (response.status === 201) {
            SuccessToast(`Order placed successfully`);
            navigate('/products');
          } else {
            ErrorToast(`Failed to place order`)
          }
        } catch (error) {
          ErrorToast(`Failed to place order. Error: ${error}`)
        }
    } 

    const getAddress = async (addressId) => {
        try {
          const response = await Api.get(`/addresses/${addressId}`,
            {
              headers: {
                'x-auth-token': authState.access_token
              },
            });
    
          if (response.status === 200) {
            setAddress(response.data);
          } else {
            ErrorToast(`Failed to get address`)
          }
        } catch (error) {
          ErrorToast(`Failed to get address. Error: ${error}`)
        }
    } 

    useEffect(() => {
        if (!authState.isLoggedIn) {
            navigate("/login");
        }
    }, []);

    return (
        <div id='main-section'>
            <Navbar />
            <div id="stepper-div">
                <Stepper activeStep={activeStep} id="stepper">
                    <Step>
                        <StepLabel>Item</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Select Address</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirm Order</StepLabel>
                    </Step>
                </Stepper>
            </div>
            <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} >
                <div>
                    {activeStep === 0 && (
                        navigate(`/product/details/${product.id}`, { state: { productOrderQuantity: product.quantity } })
                    )}
                    {activeStep === 1 && (
                        <AddressForm onSelect={handleOnAddressSelect} selectAddressParent={selectedAddressLabel} />
                    )}
                    {activeStep === 2 && (
                        <OrderPreview product={product} address={address}/>
                    )}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={activeStep === 1 ? validateAndMoveNext : handlePlaceOrder} className='button'>
                        {activeStep === 2 ? 'place order' : 'Next'}
                    </Button>
                </div>
            </Stack>
        </div>
    );

}

export default Order;