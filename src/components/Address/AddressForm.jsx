import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { Button, MenuItem, Stack, InputLabel, Select, Box, Divider } from '@mui/material';

import { TextField } from '@mui/material';
import Api from '../../common/Api';
import './AddressForm.css';
import ErrorToast, { SuccessToast } from '../../common/Toasts/Toasts';


function AddressForm({onSelect, selectAddressParent}) {
  const { authState } = useAuth();
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [landmark, setLandmark] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [selectAddress, setSelectAddress] = useState(selectAddressParent);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/addresses',
        {
          "name": name,
          "contactNumber": contactNumber,
          "street": street,
          "city": city,
          "state": state,
          "landmark": landmark,
          "zipcode": zipCode
        },
        {
          headers: {
            'x-auth-token': authState.access_token
          },
        });

      if (response.status === 201) {
        SuccessToast(`Address successfully added!`);
        fetchAddress();
        resetAddressFields();
      } else {
        ErrorToast(`Failed to add address!`)
      }
    } catch (error) {
      ErrorToast(`Failed to add address! Error: ${error}`)
    }
  };

  const handleOnAddressSelect = (e) => {
    const key = e.target.dataset.value;
    const label = e.target.dataset.label;
    setSelectAddress(label); 
    onSelect(key, label);
  }

  const resetAddressFields = () => {
    setName('');
    setContactNumber('');
    setStreet('');
    setCity('');
    setLandmark('');
    setZipCode('');
    setState('');
  };

  const fetchAddress = async () => {
    try {
      const response = await Api.get('/addresses',
        {
          headers: {
            'x-auth-token': authState.access_token
          },
        });
      if (response.status === 200) {
        setAddressList([...response.data]);
      } else {
        console.error('Failed to fetch select address');
      }
    } catch (error) {
      console.error('Error fetching select address:', error);
    }
  };


  useEffect(() => {
    fetchAddress();
  }, []);

  return (

    <div style={{ background: '#f5f5f5' }}>
      <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} >
        <Stack direction="column" alignItems="flex-start" justifyItems="left" spacing={1} >
          <InputLabel id="sort-by-label" >Select Address</InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown"
            label="Select Option"
            sx={{ height: '40px', width: '500px' }}
            value={selectAddress ?? 'Select...'}
            renderValue={(value) => (
              <Box display="flex">
                <span>{value}</span>
                <Divider orientation='vertical' flexItem style={{ marginLeft: 'auto' }} />
              </Box>
            )}
            
          >

            {addressList && addressList.map((address) => (
              <MenuItem key={address.id} value = {address.id} data-label={`${address.name}--> ${address.street}, ${address.city}`} onClick={handleOnAddressSelect}>
                {`${address.name}--> ${address.street}, ${address.city}`}
              </MenuItem>
            ))}

          </Select>
        </Stack>
        <center>-OR-</center>
        <p><center>Add Address</center></p>
        <form onSubmit={handleSaveAddress}>
          <Stack spacing={2} sx={{ width: '400px', margin: 'auto' }}>
            <TextField
              label="Name"
              variant="outlined"
              type="text"
              sx={{ mb: 4 }}
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
            <Button type="submit" variant="contained" color="primary" className='button'>
              Save Address
            </Button>
          </Stack>
        </form>
      </Stack>
    </div>
  );

}

export default AddressForm;