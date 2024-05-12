import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Api from '../../common/Api';
import Lock from '@mui/icons-material/Lock'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../../common/AuthContext';
import { iconBgColor } from '../../common/Constants';
import Navbar from '../../common/navbar/NavBar';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { logIn } = useAuth();

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (!validateEmail(newEmail)) {
            setError('Invalid email address');
        } else {
            setError('');
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/auth/signin', { 'username': email, 'password': password });
            if (response.status === 200) {
                logIn(email, true, response.data['token']);
                navigate('/products');
            } else if (response.status === 401) {
                alert(`User is not authorized. Invalid Email or Password!`)
            }
        } catch (error) {
            alert(`User is not authorized. Invalid Email or Password!`)
        }
    };

    return (
        <>
            <Navbar />
            <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} sx={{
                marginTop: '5%'
            }}>
                <Lock sx={{
                    color: 'white',
                    backgroundColor: iconBgColor,
                    borderRadius: '50%',
                    padding: '10px'
                }}></Lock>
                <Typography variant='body1'>Sign In</Typography>
                <form onSubmit={handleSignIn}>
                    <Stack spacing={2} sx={{ width: '350px', margin: 'auto' }}>
                        <TextField variant='outlined' label='Email Address' value={email} onChange={handleEmailChange} error={!!error} helperText={error} required ></TextField>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant='contained'>Sign In</Button>
                        <label>
                            <Link to="/signup" style={{ fontSize: '12px' }}>Don't have an account? Sign Up</Link>
                        </label>
                    </Stack>
                </form>
                <label style={{ fontSize: '12px', marginTop: '100px' }}>Copyright &copy; <a href='https://www.upgrad.com/' target='_blank'>upGrad</a> 2021. </label>
            </Stack>
        </>
    );
}

export default SignIn;