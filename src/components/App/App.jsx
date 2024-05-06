import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Products from '../Product/Product';
import AddUpdateProduct from '../addUpdateProduct/AddUpdateProduct';
import { AuthProvider } from '../../common/AuthContext';
import { ProductProvider } from '../../common/ProductContext';


function App() {
    return <>
        <AuthProvider>
            <ProductProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/edit-product/:id" element={<AddUpdateProduct />} />
                        <Route path="/add-product" element={<AddUpdateProduct />} />
                    </Routes>
                </Router>
            </ProductProvider>
        </AuthProvider>
    </>
}

export default App;