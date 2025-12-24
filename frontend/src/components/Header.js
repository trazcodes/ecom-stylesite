import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Button, Form, FormControl, Container } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Header.css'; // Import your CSS file for styling
import brand_img from '../img/2.png';
import { isAuth } from '../Common/auth';
import { isAdminAuth } from '../Common/AdminAuth';
import useAdminAuth from '../Common/useAdminAuth';
import Searchinput from './Form/Searchinput';
import useCategory from './hooks/useCategory';
import { useCart } from './context/cart';
import { Avatar, Badge, Space } from 'antd';
import { useTheme } from '../context/ThemeContext';


// 
// https://www.youtube.com/watch?v=5mO-T2o9zuk



const Header = () => {
  const categories = useCategory();
  const [cart] = useCart();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);
  // Refs to store timeout IDs
  const timeoutRef = useRef(null);

  // Handle mouse enter on dropdown
  const handleDropdownMouseEnter = (name) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    // Open this dropdown
    setOpenDropdown(name);
  };

  // Handle mouse leave on dropdown
  const handleDropdownMouseLeave = () => {
    // Set a timeout to close the dropdown after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 500);
  };
  
  // Close dropdown when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (openDropdown) {
        setOpenDropdown(null);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [openDropdown]);
  
  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isAdminAuth = useAdminAuth();
  
  return (
    <div className=''>
      <Navbar expand="lg" className={isDarkMode ? 'dark-mode' : 'light-mode'}>
        <div className="container-fluid ps-lg-5 pe-lg-5 ">
          <Navbar.Brand href="/" className='col-2  m-0'>
            <div className="iconcontainer">
              <div className="icon col-lg-3">
                <img src={brand_img} alt="Icon1" /></div>
              <span className='d-none d-lg-inline-block col-lg-9 brand-name'
                style={{ paddingLeft: '2px', paddingTop: '0px', color: `${isDarkMode ? '#E27D60' : '#243638'}` }}>StyleSite</span>
            </div>
          </Navbar.Brand>

          {/* Search bAr */}
          <Searchinput />

          {[false].map((expand) => (
            <Nav key={expand} className='col-3 color-pink'>
              <Navbar.Toggle style={{ border: 'none', color: 'red'}} aria-controls={`offcanvasNavbar-expand-${expand}`}><i className="fa-solid fa-bars-staggered fa-xl"></i></Navbar.Toggle>
              <Navbar.Offcanvas
                placement="end"
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                style={{ backgroundColor: `${isDarkMode ? 'black' : 'orange'}` }}>
                <Offcanvas.Header className=' p-0 pe-4 pt-1' closeButton>
                  <Button variant="" className={`col-2 ${isDarkMode ? 'on' : 'off'}`} onClick={toggleTheme}>
                    <i className={`fa-xl ${isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun"}`}></i>
                  </Button>
                  <Offcanvas.Title className='brand-name col-8' style={{ color: `${isDarkMode ? '#E27D60' : '#243638'}` }} id={`offcanvasNavbarLabel-expand-${expand}`}>
                    StyleSite
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <hr className="horizontal-line d-lg-none" />

                <Offcanvas.Body className={`me-auto `}>
                  <Nav className='  '>
                    <Button variant="" className={`col-lg d-none d-lg-inline ${isDarkMode ? 'on' : 'off'}`} onClick={toggleTheme}>
                      <i className={`fa-xl ${isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun"}`}></i>
                    </Button>

                    {!isAuth() &&
                      <>
                        <Nav.Link className='header-btn' href="/login">
                          <i className="fa-solid fa-user"></i><br />Login </Nav.Link>
                        <Nav.Link className='header-btn' href="/register">
                          <i className="fa-solid fa-user"></i><br />Register </Nav.Link>
                      </>}

                    {isAdminAuth &&
                      <>
                        <Nav.Link className='header-btn' href="/admin/manage-products">
                          <i className="fa-solid fa-user"></i><br />Admin</Nav.Link>
                        </>}

                    {
                      <>
                        <Nav.Link href="/cart" className=' header-btn'>
                          <Space size="medium">
                            <Badge size='small' count={cart?.length}>
                              <i className={`fa-solid fa-cart-shopping ${isDarkMode ? "text-light" : "text-dark"}`}></i>
                            </Badge>
                          </Space>
                          <br />Cart
                        </Nav.Link>
                      </>}
                    {isAuth() &&
                      <>
                        <Nav.Link className='header-btn' href="/user/dashboard">
                          <i className="fa-solid fa-user"></i><br />Dashboard</Nav.Link>
                        <Nav.Link className='header-btn' href="/user/logout">
                          <i className="fa-solid fa-user"></i><br />Logout</Nav.Link>
                        </>}
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Nav>))}
        </div>
      </Navbar>

      <div className="nav2-container">
        <div className="container">
          <div className="main-navigation">
            <a href="/home" className="main-nav-item">HOME</a>
            <a href="/all" className="main-nav-item">ALL PRODUCTS</a>
            <div 
              className="main-nav-dropdown"
              onMouseEnter={() => handleDropdownMouseEnter('women')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="dropdown-label">WOMEN</div>
              <div className={`dropdown-content ${openDropdown === 'women' ? 'show' : ''}`}>
                <a href={`/category/all/women`} className="dropdown-item">All Products</a>
                {categories?.filter(c => c.mainCategory === 'women').map(c => (
                  <a key={c.slug} href={`/category/${c.slug}`} className="dropdown-item">
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </a>
                ))}
              </div>
            </div>
            <div 
              className="main-nav-dropdown"
              onMouseEnter={() => handleDropdownMouseEnter('men')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="dropdown-label">MEN</div>
              <div className={`dropdown-content ${openDropdown === 'men' ? 'show' : ''}`}>
                <a href={`/category/all/men`} className="dropdown-item">All Products</a>
                {categories?.filter(c => c.mainCategory === 'men').map(c => (
                  <a key={c.slug} href={`/category/${c.slug}`} className="dropdown-item">
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </a>
                ))}
              </div>
            </div>
            <div 
              className="main-nav-dropdown"
              onMouseEnter={() => handleDropdownMouseEnter('kids')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="dropdown-label">KIDS</div>
              <div className={`dropdown-content ${openDropdown === 'kids' ? 'show' : ''}`}>
                <a href={`/category/all/kids`} className="dropdown-item">All Products</a>
                {categories?.filter(c => c.mainCategory === 'kids').map(c => (
                  <a key={c.slug} href={`/category/${c.slug}`} className="dropdown-item">
                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                  </a>
                ))}
              </div>
            </div>
            <a href="/cart" className="main-nav-item">
              <span>CART</span>
              <Badge count={cart?.length} size="small" style={{marginLeft: '5px'}} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
