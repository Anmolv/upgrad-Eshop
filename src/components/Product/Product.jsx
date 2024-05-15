import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useProduct } from '../../common/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton, Divider, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Api from '../../common/Api';
import Navbar from '../../common/navbar/NavBar';
import { SuccessToast, ErrorToast } from "../../common/Toasts/Toasts";
import ConfirmationModal from '../../common/comfirmationModal/ConfirmationModal';

const ProductCard = ({ product, isAdmin, handleDeleteProduct }) => {
    const navigate = useNavigate();
    return (
        <Card sx={{ width: 400 }}>
            <CardMedia
                component="img"
                alt={product.name}
                height="200"
                image={product.imageUrl}
                title={product.name}
            />
            <CardContent>
                <Stack direction="row" justifyContent='space-between'>
                    <Typography variant="h6" component="h6">
                        {product.name}
                    </Typography>
                    <Typography variant="h6" component="h6">
                        ₹{product.price}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="textSecondary" component="p" sx={{ marginBottom: '40px' }} >
                    {product.description}
                </Typography>
                <Stack direction="row" justifyContent='space-between'>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/product/details/${product.id}`)}>
                        Buy
                    </Button>
                    {isAdmin && (
                        <div>
                            <IconButton onClick={() => navigate(`/edit-product/${product.id}`)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteProduct(product.id, product.name)}>
                                <Delete />
                            </IconButton>
                        </div>
                    )}
                </Stack>


            </CardContent>
        </Card>
    );
};

const ProductList = ({ products, isAdmin, handleDeleteProduct }) => {
    return (
        <Grid container spacing={2} sx={{ paddingTop: '20px', paddingLeft: '80px', paddingRight: '40px' }}>
            {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                        product={product}
                        isAdmin={isAdmin}
                        handleDeleteProduct={handleDeleteProduct}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

function Products() {
    const { authState } = useAuth();
    const navigate = useNavigate();
    const { productState, setProducts } = useProduct();
    const [filteredProducts, setFilteredProducts] = useState(productState.products);
    const [categories, setCategories] = useState(['All']);
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState("");
    const [deleteProductName, setDeleteProductName] = useState("");

    const handleDeleteProduct = (id, name) => {
        setShowConfirmation(true);
        setDeleteProductId(id);
        setDeleteProductName(name);
    };

    const handleConfirmDelete = () => {
        Api
            .delete(`/products/${deleteProductId}`, {
                headers: {
                    'x-auth-token' : authState.access_token,
                },
            })
            .then(function (response) {
                SuccessToast(`Product ${deleteProductName} deleted successfully`);
                getAllProducts();
            })
            .catch(function (error) {
                ErrorToast(
                    `Error: There was an issue in deleting product, please try again later.`
                );
            });
        setShowConfirmation(false);
    };

    const getAllCategories = async () => {
        try {
            const response = await Api.get('/products/categories');
            if (response.status === 200) {
                setCategories(['All', ...response['data']]);
            } else if (response.status === 401) {
                alert(`Failed to fetch categories!`);
            }
        } catch (error) {
            alert(`Failed to fetch categories!`);
        }
    }

    const getAllProducts = async () => {
        try {
            const response = await Api.get('/products');
            if (response.status === 200) {
                setProducts([...response['data']]);
                setFilteredProducts([...response['data']]);
            } else if (response.status === 401) {
                alert(`Failed to fetch products!`);
            }
        } catch (error) {
            alert(`Failed to fetch products!`);
        }
    }

    useEffect(() => {
        if (!authState.isLoggedIn) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        getAllCategories();
        getAllProducts();
    }, []);


    const handleFilter = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
        if (selectedCategory === 'All') {
            setFilteredProducts(productState.products);
        } else {
            const filtered = productState.products.filter((product) => {
                return product.category === selectedCategory;
            });
            setFilteredProducts(filtered);
        }
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'Price: High To Low':
                return b.price - a.price;
            case 'Price: Low To High':
                return a.price - b.price;
            case 'Newest':
                return b.id - a.id;
            default:
                return 0;
        }
    });

    const searchProducts = (searchQuery) => {
        const filtered = productState.products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <>
            <Navbar onSearch={searchProducts} />
            <Stack>
                <ToggleButtonGroup value={category} exclusive onChange={handleFilter} sx={{ margin: '10px', justifyContent: 'center' }}>
                    {

                        categories.map((category) => (
                            <ToggleButton key={category} value={category}>
                                {category}
                            </ToggleButton>
                        ))
                    }
                </ToggleButtonGroup>

                <div style={{ marginLeft: '20px' }}>
                    <InputLabel id="sort-by-label" >Sort By:</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        id="sort-by"
                        value={sortBy ?? 'Select...'}
                        onChange={(e) => setSortBy(e.target.value)}
                        renderValue={(value) => (
                            <Box display="flex">
                                <span>{value}</span>
                                <Divider orientation='vertical' flexItem style={{ marginLeft: 'auto' }} />
                            </Box>
                        )}
                        sx={{ height: '40px', width: '300px' }}
                    >
                        <MenuItem value="Default">Default</MenuItem>
                        <MenuItem value="Price: High To Low">Price: High to Low</MenuItem>
                        <MenuItem value="Price: Low To High">Price: Low to High</MenuItem>
                        <MenuItem value="Newest">Newest</MenuItem>
                    </Select>
                </div>
                <ProductList
                    products={sortedProducts}
                    isAdmin={authState.isAdmin}
                    handleDeleteProduct={handleDeleteProduct}
                />
            </Stack>
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={() => { handleConfirmDelete() }}
            />
        </>
    );

}

export default Products;