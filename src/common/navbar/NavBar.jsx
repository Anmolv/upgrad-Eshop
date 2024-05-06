import { React } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchBar from '../../components/SearchBar/SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { iconBgColor } from '../Constants';

const Navbar = ({ onSearch }) => {
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
                        <SearchBar onSearch={onSearch} />
                        <Button color="inherit">
                            <Link to="/products" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                Home
                            </Link>
                        </Button>

                        {authState.isAdmin && (
                            <Button color="inherit">
                                <Link to="/add-product" style={{ color: 'inherit', textTransform: 'none', textDecoration: 'underline' }}>
                                    Add Product
                                </Link>
                            </Button>
                        )}

                        <Button color="inherit" onClick={handleLogout} sx={{ backgroundColor: iconBgColor }}>
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
}

export default Navbar;