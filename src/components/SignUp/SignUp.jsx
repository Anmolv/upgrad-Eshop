import React, { useState } from 'react';
import { Button, Stack, TextField, Typography } from '@mui/material';
import Lock from '@mui/icons-material/Lock'
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import Api from '../../common/Api';
import {iconBgColor} from '../../common/Constants';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (!validateEmail(newEmail)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePasswords(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validatePasswords(password, e.target.value);
    };

    const validatePasswords = (password, confirmPassword) => {
        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const validateContactNumber = (contactNumber) => {
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(contactNumber);
    };

    const handleContactNumberChange = (e) => {
        const newContactNumber = e.target.value;
        setContactNumber(newContactNumber);

        if (!validateContactNumber(newContactNumber)) {
            setContactNumberError('Invalid contact number');
        } else {
            setContactNumberError('');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (passwordError === '' && emailError === '' && contactNumberError === '') {
            try {
                const response = await Api.post('/auth/signup',
                    {
                        "email": email,
                        "password": password,
                        "firstName": firstName,
                        "lastName": lastName,
                        "contactNumber": contactNumber
                    });
                if (response.status === 200) {
                    alert(`User: ${email} registered success`);
                    navigate('/login');

                } else {
                    alert(`User: ${email} registered failed ${response.data}`)
                }
            } catch (error) {
                alert('Sign-up failed:', error);
            }
        } else {
            alert('Password and Confirm Password are not same. Please try again!');
            setConfirmPassword('');
            setPassword('');
        }
    };

    return (
        <Stack direction="column" alignItems="center" justifyItems="center" spacing={2} sx={{
            marginTop: '5%'
        }}>
            <Lock sx={{
                color: 'white',
                backgroundColor: iconBgColor,
                borderRadius: '50%',
                padding: '10px'
            }}></Lock>
            <Typography variant='body1'>Sign up</Typography>
            <form onSubmit={handleSignUp}>
                <Stack spacing={2} sx={{ width: '350px', margin: 'auto' }}>
                    <TextField variant='outlined' label='First Name' onChange={(e) => setFirstName(e.target.value)} required ></TextField>
                    <TextField variant='outlined' label='Last Name' onChange={(e) => setLastName(e.target.value)} required ></TextField>
                    <TextField variant='outlined' label='Email Address' value={email} onChange={handleEmailChange} error={!!emailError} helperText={emailError} required ></TextField>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        error={!!passwordError} helperText={passwordError}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        error={!!passwordError} helperText={passwordError}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <TextField variant='outlined' label='Contact Number' onChange={handleContactNumberChange} error={!!contactNumberError} helperText={contactNumberError} required ></TextField>
                    <Button type="submit" variant='contained'>Sign up</Button>
                    <label id='sign-in-label'>
                        <Link to="/login" style={{ fontSize: '12px' }}>Already have an account? Sign in</Link>
                    </label>
                </Stack>
            </form>
            <label style={{ fontSize: '12px', marginTop: '100px' }}>Copyright &copy; <a href='https://www.upgrad.com/' target='_blank'>upGrad</a> 2021. </label>
        </Stack>
    );
}

export default SignUp;