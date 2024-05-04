import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, IconButton, Grid, Menu, MenuItem, Stack, ToggleButtonGroup, InputLabel, Select, ToggleButton } from '@mui/material';
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
        price: 30,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        category: 'Category C',
    },
    {
        id: 4,
        name: 'Product 4',
        image: image2,
        price: 30,
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        category: 'Category C',
    }
];

const ProductCard = ({ product, isAdmin, onEdit, onDelete }) => {
    return (
        <Card>
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
                    <Button variant="contained" color="primary">
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

const ProductList = ({ products, isAdmin, handleEdit, handleDelete }) => {
    return (
        <Grid container spacing={3}>
            {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <ProductCard
                        product={product}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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


    // useEffect(() => {
    //     if (!authState.isLoggedIn) {
    //         navigate("/login");
    //     }
    // }, []);

    const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
    const [anchorEl, setAnchorEl] = useState(null);
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState(null);

    const handleCategoryChange = (event, newCategory) => {
        setCategory(newCategory);
    };

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilter = (category) => {
        const filtered = dummyProducts.filter((product) => product.category === category);
        setFilteredProducts(filtered);
        setAnchorEl(null);
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'PriceHighToLow':
                return b.price - a.price;
            case 'PriceLowToHigh':
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
        <Stack alignItems='center'>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                displayEmpty
                placeholder='Select...'
                onChange={handleSortByChange}
            >
                <MenuItem value="" disabled>
                    Select...
                </MenuItem>
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="PriceHighToLow">Price: High to Low</MenuItem>
                <MenuItem value="PriceLowToHigh">Price: Low to High</MenuItem>
                <MenuItem value="Newest">Newest</MenuItem>
            </Select>

            <ToggleButtonGroup value={category} exclusive onChange={handleCategoryChange}>
                {categories.map((category) => (
                    <ToggleButton key={category} value={category}>
                        {category}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <ProductList
                products={filteredProducts}
                isAdmin={authState.isAdmin}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </Stack>
    );

}

export default Products;