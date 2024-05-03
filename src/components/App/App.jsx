import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import Products from '../Product/Product';
import { AuthProvider } from '../../common/AuthContext';
import Navbar from '../../common/navbar/NavBar';

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
                </Routes>
            </Router>
        </AuthProvider>
    </>
}

export default App;