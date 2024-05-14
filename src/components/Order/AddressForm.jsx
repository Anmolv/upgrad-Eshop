import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, Menu, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton } from '@mui/material';
import { Edit, Delete, Label } from '@mui/icons-material';

import { useParams } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useProduct } from '../../common/ProductContext';
import Navbar from '../../common/navbar/NavBar';
import Api from '../../common/Api';


function AddressForm({ onSaveAddress, addresses }) {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const { productState, setProducts } = useProduct();
    const [filteredProducts, setFilteredProducts] = useState(productState.products);
  

    const searchProducts = (searchQuery) => {
      const filtered = productState.products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
  };
  

    const steps = ['Items', 'Select Address', 'Confirm Order'];
 
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [zipCode, setZipCode] = useState('');
  //const [selectedAddress, setSelectedAddress] = useState('');
  const [selectAddress, setSelectAddress] = useState('');

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
  
        const response = await Api.post('/api/addresses',
                    {
                      "name": name,
                      "contactNumber": contactNumber,
                      "street": street,
                      "city": city,
                      "state": state,
                      "landmark": landmark,
                      "zipCode": zipCode
                    });
                if (response.status === 200) {
                    alert(`Added`);

                } else {
                    alert(`failed ${response.data}`)
                }
    } catch (error) {
        console.error('Error saving address:', error);
        // Handle error, maybe show a message to the user
    }
};

useEffect(() => { 
  const fetchData = async () => { 
      try { 
          const response = await axios.get('http://localhost:8080/api/addresses'); 
          if (response.status === 200) { 
              // Update state with fetched data 
              setSelectAddress(response.data); 
          } else { 
              console.error('Failed to fetch select address'); 
          } 
      } catch (error) { 
          console.error('Error fetching select address:', error); 
      } 
  }; 
 
  fetchData(); // Call the fetchData function when the component mounts 
}, []); // Empty dependency array to run the effect only once 
/*
for fetchinh

{selectAddress && selectAddress.map((address) => (
                                <MenuItem key={address.id} value={address.id}>{`${address.name} - ${address.street}, ${address.city}`}</MenuItem>
                            ))}


                             </Select> 
        <InputLabel id="dropdown-label"><center>Select...</center></InputLabel>
        <Select
          labelId="dropdown-label"
          id="dropdown"
          label="Select Option"
          name='Select...'
          style={{ width: '500px',background: 'white' }}
        >
       
       <MenuItem value="option1">Lucknow Home-->Police Line ,Lucknow</MenuItem>
         
     </Select>
*/

    const activeStep = 1;
    return (

      <div style={{ background: '#f5f5f5' }}>

<Navbar onSearch={searchProducts} />
        <Stack alignItems='center'>

<br></br>
<br></br>

<div style={{ width: '150%' }}     >
      <Stepper activeStep={activeStep} alternativeLabel   style={{ background: 'white' ,marginLeft: '450px', marginRight: '450px'}}>
        {steps.map((label) => (
          <Step key={label}   >
            <StepLabel  >{label}</StepLabel>
            
          </Step>
        ))}
      </Stepper>

      
    </div>
    <p style={{ marginRight: '400px', fontSize: '1rem' }}>Select Address</p>
 
    
    <form >
      <FormControl fullWidth>
   

      <InputLabel id="dropdown-label"><center>Select...</center></InputLabel> 
        <Select 
          labelId="dropdown-label" 
          id="dropdown" 
          label="Select Option" 
          name='Select...' 
          style={{ width: '500px',background: 'white' }} 
          value={selectAddress} //Use the component's state value
          onChange={(e) => setSelectAddress(e.target.value)}// Add onChange event handler function to update the selected address value
        > 
        
        {/* Generate menu items based on dynamic data */}
        {selectAddress && selectAddress.map((address) => ( 
            <MenuItem key={address.id} value={address.id}>
            {`${address.name} - ${address.street}, ${address.city}`}
        </MenuItem>
        ))}
          
    </Select>
      </FormControl>
      <p>

      
      </p>
      
      </form>
      
      <center>-OR-</center>
     <p><center>Add Address</center></p>
     <form onSubmit={handleSaveAddress}>
     <TextField
              label="Name"
            
              variant="outlined"
              type="text"
              sx={{ mb: 4}}
              required
             fullWidth
             value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '300px' }}
             
            />
      <br></br>
      <TextField
              label="Contact Number"
       
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              required
              fullWidth
              value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
             
            />
            <br>
            </br>
            <TextField
              label="Street"
            
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
             fullWidth
             
            />
      <br></br>
      <TextField
              label="City"
         
              variant="outlined"
              type="text"
              value={city}
        onChange={(e) => setCity(e.target.value)}
              sx={{ mb: 3 }}
              required
              fullWidth
             
            />
    
      
      <br></br>
      <TextField
              label="State"
             
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              required
             fullWidth
             value={state}
             onChange={(e) => setState(e.target.value)}
             
            />
      <br></br>
      <TextField
              label="Landmark"
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              required
              value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
              fullWidth
             
            />
      <br></br>
      <TextField
              label="Zip Code"
              variant="outlined"
              type="text"
              sx={{ mb: 3 }}
              value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
              required
             fullWidth
             
            />
      
      <br></br>
      <Button type="submit" variant="contained" color="primary" sx={{ width: '250px' }}    style={{ width: '300px' }}>
        Save Address
      </Button>
      </form>
     
      <br></br>
      <div style={{ display: 'flex', gap: '10px' }}>
      <Button type="submit" variant="contained" color="primary" style={{ width: '50px' }} onClick={() => navigate('/productdetails')}>
        Back
      </Button>
      <Button type="submit" variant="contained" color="primary" style={{ width: '50px' }}  onClick={() => navigate('/orders')} >
        Next
      </Button>
    </div>
      
    </Stack>
    </div>
           
       

        
        
    );

                }
    



export default AddressForm;