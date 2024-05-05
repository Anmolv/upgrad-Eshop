import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [productState, setProductState] = useState({
    products: []
  });


  const setProducts = (products) => {
    setProductState({
        products: products
    });
  };

  return (
    <ProductContext.Provider value={{ productState, setProducts}}>
      {children}
    </ProductContext.Provider>
  );
};
