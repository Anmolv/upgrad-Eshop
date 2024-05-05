import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Products from '../Product/Product';
import AddUpdateProduct from '../addUpdateProduct/AddUpdateProduct';
import { AuthProvider } from '../../common/AuthContext';
import Navbar from '../../common/Navbar/navBar';

function App() {
    return <>
        <AuthProvider>
            <Router>
                <Navbar />

                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/editProduct" element={<AddUpdateProduct />} />
                    <Route path="/addProduct" element={<AddUpdateProduct />} />
                </Routes>
            </Router>
        </AuthProvider>
    </>
}

export default App;