import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, Menu, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton, Divider, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';

const dummyProducts = [
    {
        id: 1,
        name: 'Product 1',
        image: image1,
        price: 20,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        category: 'Category A',
    },
    {
        id: 2,
        name: 'Product 2',
        image: image2,
        price: 30,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        category: 'Category B',
    },
    {
        id: 3,
        name: 'Product 3',
        image: image1,
        price: 40,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        category: 'Category C',
    },
    {
        id: 4,
        name: 'Product 4',
        image: image2,
        price: 20,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        category: 'Category C',
    }
];

const ProductCard = ({ product, isAdmin, onEdit, onDelete, onBuy }) => {
    return (
        <Card sx={{ width: 400 }}>
            <CardMedia
                component="img"
                alt={product.name}
                height="200"
                image={product.image}
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
                            <IconButton onClick={() => onEdit(product.id)}>
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
        <Grid container spacing={2} sx={{paddingTop: '20px', paddingLeft: '80px', paddingRight: '40px'}}>
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

const categories = ['All', 'Category A', 'Category B', 'Category C'];


function Products() {
    const { authState } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authState.isLoggedIn) {
            navigate("/login");
        }
    }, []);

    const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState(null);


    const handleFilter = (event) => {
        const selectedCategory = event.target.value;
        setCategory(selectedCategory);
        if (selectedCategory === 'All') {
            setFilteredProducts(dummyProducts);
        } else {
            const filtered = dummyProducts.filter((product) => {
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
        // Handle delete functionality
    };

    return (
        <Stack>
            <ToggleButtonGroup value={category} exclusive onChange={handleFilter} sx={{ margin: '10px', justifyContent: 'center' }}>
                {categories.map((category) => (
                    <ToggleButton key={category} value={category}>
                        {category}
                    </ToggleButton>
                ))}
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
                handleBuy = {handleBuy}
            />
        </Stack>
    );

}

export default Products;