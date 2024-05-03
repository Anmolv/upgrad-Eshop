import React, { useState } from 'react';
import axios from 'axios';

function Products() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/products', { params: { q: query } });
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {/* Display the list of products */}
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;