import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Footer from './components/Footer';
import Register from './components/Register';
import { useState, useEffect } from 'react';
import Headroom from 'react-headroom';
import PrivateRoute from './Common/PrivateRoute';
import Logout from './components/Logout';
import AdminRoute from './Common/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext';
import { isAuth } from './Common/auth';
import { isAdminAuth } from './Common/AdminAuth';
import useAdminAuth from './Common/useAdminAuth';
import Home from './Home';
import CreateProduct from './components/Admin/CreateProduct';
import CreateCategory from './components/Admin/CreateCategory';
import UpdateProduct from './components/Admin/UpdateProduct';
import ManageUser from './components/Admin/ManageUser';
import ManageOrder from './components/Admin/ManageOrder';
import Search from './components/Search';
import ProductDetails from './components/ProductDetails';
import MenProducts from './components/Users/Men/MenProducts';
import CategoryProduct from './components/Users/CategoryProduct';
import WomenProducts from './components/Users/Women/WomenProducts';
import KidsProducts from './components/Users/Kids/KidProducts';
import MainCategoryProduct from './components/Users/MainCategoryProduct';
import CartPage from './components/CartPage';
import AllProduct from './components/AllProduct';
import AdminAllProducts from './components/Admin/AdminAllProducts';
import UserDashboard from './components/Users/UserDashboard';
import UserProfile from './components/Users/UserProfile';
import ErrorRedirect from './components/ErrorRedirect';
import './components/DarkMode.css';
import { ThemeProvider } from './context/ThemeContext';
import { initTheme } from './utils/theme';

function App() {
  const isAdminAuth = useAdminAuth();
  console.log("User ? " + isAuth());
  console.log("Admin ? " + isAdminAuth);
  
  // Initialize theme immediately
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="App">
          <div>
            <Headroom>
              <Header />
            </Headroom>
            <Routes>
              <Route path="/" element={<AllProduct/>} index={true} />
              <Route path="/search" element={<Search/>} />
              <Route path="/product/:slug" element={<ProductDetails/>} />
              <Route path="/category/men" element={<MenProducts/>} />
              <Route path="/category/women" element={<WomenProducts/>} />
              <Route path="/category/kids" element={<KidsProducts/>} />
              <Route path="/category/:slug" element={<CategoryProduct/>} />
              <Route path="/category/all/:mainCategory" element={<MainCategoryProduct/>} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/cart' element={<CartPage/>} />
              <Route path='/all' element={<AllProduct/>} />
              <Route path='/home' element={<Home />} />

              {/* PRIVATE ROUTE */}
              <Route path='/user' element={<PrivateRoute />} >
                
                <Route path='dashboard' element={<UserDashboard/>} />
                <Route path='dashboard/profile' element={<UserProfile/>} />
                <Route path='dashboard/orders' element={<UserDashboard/>} />
                <Route path='logout' element={<Logout />} /> 
              </Route> 
              
              <Route path='/admin' element={<AdminRoute />} >
                <Route path='dashboard' element={<AdminDashboard/>} />
                <Route path='create-category' element={<CreateCategory/>} />
                <Route path='create-product' element={<CreateProduct/>} />
                <Route path='manage-user' element={<ManageUser/>} />
                <Route path='manage-order' element={<ManageOrder/>} />
                <Route path='manage-products' element={<AdminAllProducts/>} />
                <Route path='product/:slug' element={<UpdateProduct/>} />
                <Route path='logout' element={<Logout />} /> 
              </Route> 
              
              {/* Catch-all route for 404 errors */}
              <Route path="*" element={<ErrorRedirect />} />
            </Routes>
            <Footer/>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
