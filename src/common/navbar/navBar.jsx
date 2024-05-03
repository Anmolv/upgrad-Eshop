import React from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Box } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {iconBgColor} from '../Constants';

function Navbar() {
    const { authState, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate('/');
    };

    return (
        <AppBar position="static" sx={{
            backgroundColor: '#3f51b5',
        }}>
            <Toolbar>
                <ShoppingCart fontSize='small' />
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    upGrad E-Shop
                </Typography>

                {authState.isLoggedIn ? (
                    <>
                        <SearchBar />
                        <Button color="inherit">
                            <Link to="/" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                Home
                            </Link>
                        </Button>

                        {authState.isAdmin && (
                            <Button color="inherit">
                                <Link to="/add-products" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                    Add Product
                                </Link>
                            </Button>
                        )}

                        <Button color="inherit" onClick={handleLogout} sx={{backgroundColor: iconBgColor}}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color="inherit">
                                <Link to="/login" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                    Login
                                </Link>
                            </Button>

                            <Button color="inherit">
                                <Link to="/signup" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                    Sign Up
                                </Link>
                            </Button>
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar >
    );

    function SearchBar() {
        return <Box style={{ flexGrow: 8, display: 'flex', justifyContent: 'center' }}>
            <TextField
                variant="outlined"
                placeholder="Search..."
                size="small"
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    borderBlockColor: 'rgba(255, 255, 255, 0.2)',
                    width: '30%',
                    input: {
                        color: 'white'
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <SearchIcon position="start" style={{ marginRight: 8, color: 'white' }} />
                    ),
                }} />
        </Box>;
    }
}

export default Navbar;