import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useProduct } from '../../common/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton, Divider, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Api from '../../common/Api';
import Navbar from '../../common/navbar/NavBar';
import { SuccessToast, ErrorToast } from "../../common/Toasts/Toasts";
import axios from "axios";

const ProductCard = ({ product, isAdmin, onEdit, onDelete, onBuy }) => {
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
                    <Button variant="contained" color="primary" onClick={onBuy}>
                        Buy
                    </Button>
                    {isAdmin && (
                        <div>
                            <IconButton onClick={() => navigate(`/editProduct/${product.id}`)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => onDelete(product.id)}>
                                <Delete />
                            </IconButton>
                        </div>
                    )}
                </Stack>


            </CardContent>
        </Card>
    );
};

const ProductList = ({ products, isAdmin, handleEdit, handleDelete, handleBuy }) => {
    return (
        <Grid container spacing={2} sx={{ paddingTop: '20px', paddingLeft: '80px', paddingRight: '40px' }}>
            {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                        product={product}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onBuy={handleBuy}
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

    const handleDeleteCall = (id) => {
        axios
          .delete(`http://localhost:8080/api/products/${id}`, {
              headers: {
                Authorization:`Bearer ${authState.access_token}`,
              },
          })
          .then(function (response) {
            console.log(`Product ${id} Deleted`);
            SuccessToast(`Product deleted successfully!`);
            //triggerDataFetch();
            navigate("/products");
          })
          .catch(function (error) {
            ErrorToast(
              `Error: There was an issue in deleting product, please try again later.`
            );
          });
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

    const handleBuy = (productId) => {
        // Handle buy functionality
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

    const handleEdit = (productId) => {
        // Handle edit functionality
    };

    const handleDelete = (productId) => {
        handleDeleteCall(productId);
    };

    const searchProducts = (searchQuery) => {
        const filtered = productState.products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
        <>
            <Navbar onSearch={searchProducts}/>
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
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleBuy={handleBuy}
                />
            </Stack>
        </>
    );

}

export default Products;