import React, { useState } from 'react';
import axios from 'axios';
import { Button, Stack, TextField, Typography } from '@mui/material';
import Lock from '@mui/icons-material/Lock'
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users', { email, password });
            // Handle response or redirect
            if (response.status === 200) {
                // Handle success (e.g., redirect to the sign-in page or a confirmation page)
            }
        } catch (error) {
            console.error('Sign-up failed:', error);
        }
    };

    return (
        <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} sx={{
            marginTop: '5%'
        }}>
            <Lock sx={{
                color: 'white',
                backgroundColor: 'rgba(245,0,87,255)',
                borderRadius: '50%',
                padding: '10px'
            }}></Lock>
            <Typography variant='body1'>Sign up</Typography>
            <form onSubmit={handleSignUp}>
                <Stack spacing={2} sx={{ width: '350px', margin: 'auto' }}>
                    <TextField variant='outlined' label='First Name' onChange={(e) => setEmail(e.target.value)} required ></TextField>
                    <TextField variant='outlined' label='Last Name' onChange={(e) => setEmail(e.target.value)} required ></TextField>
                    <TextField variant='outlined' label='Email Address' onChange={(e) => setEmail(e.target.value)} required ></TextField>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField variant='outlined' label='Contact Number' onChange={(e) => setEmail(e.target.value)} required ></TextField>
                    <Button type="submit" variant='contained'>Sign up</Button>
                    <label id='sign-in-label'>
                        <Link to="/login" style={{ fontSize:'12px' }}>Already have an account? Sign in</Link>
                    </label>
                </Stack>
            </form>
            <label style={{ fontSize: '12px', marginTop: '100px' }}>Copyright &copy; <a href='https://www.upgrad.com/' target='_blank'>upGrad</a> 2021. </label>
        </Stack>
    );
}

export default SignUp;