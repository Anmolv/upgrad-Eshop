import { TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { React, useState } from 'react';

const SearchBar = ({onSearch}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
        debouncedSearch(event.target.value);
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const debouncedSearch = debounce(onSearch, 300); 

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
            value={searchQuery}
            onChange={handleInputChange}
            InputProps={{
                startAdornment: (
                    <SearchIcon position="start" style={{ marginRight: 8, color: 'white' }} />
                ),
            }} />
    </Box>;
}

export default SearchBar;