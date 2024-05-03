import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Lock from '@mui/icons-material/Lock'
import { Button, Stack, TextField, Typography } from '@mui/material';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth', { email, password });
            if (response.status === 200) {
                navigate('/products'); // Redirect to the products page
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
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
            <Typography variant='body1'>Sign In</Typography>
            <form onSubmit={handleSignIn}>
                <Stack spacing={2} sx={{ width: '350px', margin: 'auto' }}>
                    <TextField variant='outlined' label='Email Address' onChange={(e) => setEmail(e.target.value)} required ></TextField>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant='contained'>Sign In</Button>
                    <label>
                        <Link to="/signup" style={{ fontSize:'12px' }}>Don't have an account? Sign Up</Link>
                    </label>
                </Stack>
            </form>
            <label style={{ fontSize: '12px', marginTop:'100px'}}>Copyright &copy; <a href='https://www.upgrad.com/' target='_blank'>upGrad</a> 2021. </label>
        </Stack>
    );
}

export default SignIn;