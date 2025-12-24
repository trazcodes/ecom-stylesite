import { Layout } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, Radio, Input, Button, Select, Card as AntCard, Divider, Tag } from 'antd'
import Prices from './Prices';
import {useCart} from "./context/cart"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllProduct.css';
import { SearchOutlined } from '@ant-design/icons';
import { productFilter, sortProducts, handleCategoryFilter, getSortOptions } from '../utils/filter';
import { useTheme } from '../context/ThemeContext';

function AllProduct() {
    const navigate = useNavigate();
    const [cart,setCart] = useCart([])
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem('token');
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [tempChecked, setTempChecked] = useState([]);
    const [tempRadio, setTempRadio] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();

    // get total Count
    const getTotal = async () => {
        try { 
            const resp = await axios.get('http://localhost:8080/api/count-product', {
            });
            setTotal(resp?.data?.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Toggle filter sidebar visibility for mobile
    const toggleFilter = () => {
        setShowFilter(!showFilter);
    }

    // load more
    const loadMore = async () => {
        try {
            setLoading(true)
            const {data} = await axios.get(`http://localhost:8080/api/list-product/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    // get all Products
    const getAllProducts = async () => {
        try {
            setLoading(true)
            const resp = await axios.get(`http://localhost:8080/api/list-product/${page}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLoading(false)

            setProducts(resp.data.products);
        } catch (error) {
            setLoading(false)

            console.error('Error fetching products:', error);
        }
    }
    
    // Temporary Filter by Category
    const handleTempFilter = (value, id, categoryName) => {
        const result = handleCategoryFilter(value, id, categoryName, tempChecked, selectedCategories);
        setTempChecked(result.checked);
        setSelectedCategories(result.selected);
    }
    
    // SHOW CATEGORY LIST
    const getAllCategory = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/category', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(resp.data?.category);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    
    // Filter Product
    const applyProductFilter = async (checkedCategories, priceRange) => {
        try {
            const filteredProducts = await productFilter(checkedCategories, priceRange);
            setProducts(filteredProducts);
        } catch (error) {
            console.log(error);
        }
    }

    // Handle sort
    const handleSort = (value) => {
        setSortBy(value);
        setProducts(sortProducts(products, value));
    }

    // Reset all filters
    const resetFilters = () => {
        // Clear all filter states
        setChecked([]);
        setRadio([]);
        setTempChecked([]);
        setTempRadio([]);
        setSortBy('');
        setSelectedCategories([]);
        setSelectedPrice(null);
        
        // Reload all products
        getAllProducts();
    }
    
    // Apply filters
    const applyFilters = () => {
        // Find the price label for display
        let priceLabel = null;
        if (tempRadio.length > 0) {
            const selectedPriceRange = Prices.find(p => 
                JSON.stringify(p.array) === JSON.stringify(tempRadio)
            );
            priceLabel = selectedPriceRange?.name || null;
        }
        
        // Update state for displaying filters
        setChecked(tempChecked);
        setRadio(tempRadio);
        setSelectedPrice(priceLabel);
        
        // Call filter directly with temp values
        if (tempChecked.length > 0 || tempRadio.length > 0) {
            applyProductFilter(tempChecked, tempRadio);
        } else {
            getAllProducts();
        }
    }
    
    // Remove category filter
    const removeCategoryFilter = (id) => {
        // Update visual filter state
        setSelectedCategories(prev => prev.filter(cat => cat.id !== id));
        setTempChecked(prev => prev.filter(c => c !== id));
        
        // Update actual filter states
        const updatedChecked = checked.filter(c => c !== id);
        setChecked(updatedChecked);
        
        // Apply filters immediately
        if (updatedChecked.length > 0 || radio.length > 0) {
            applyProductFilter(updatedChecked, radio);
        } else {
            getAllProducts();
        }
    }
    
    // Remove price filter
    const removePriceFilter = () => {
        // Update UI states
        setSelectedPrice(null);
        setTempRadio([]);
        setRadio([]);
        
        // Apply filters immediately
        if (checked.length > 0) {
            applyProductFilter(checked, []);
        } else {
            getAllProducts();
        }
    }
    
    // Handle add to cart with incremental quantity
    const handleAddToCart = (product) => {
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item._id === product._id);
        
        if (existingProductIndex !== -1) {
            // Product exists, update quantity
            const updatedCart = [...cart];
            const currentQuantity = updatedCart[existingProductIndex].quantity || 1;
            
            // Validate against product quantity (admin-set limit)
            const maxQuantity = product.quantity;
            
            if (maxQuantity && currentQuantity >= maxQuantity) {
                // Don't increase beyond max quantity
                toast.warning(`Maximum available quantity (${maxQuantity}) reached for ${product.name}`);
                return;
            }
            
            // Update quantity if within limits
            updatedCart[existingProductIndex].quantity = currentQuantity + 1;
            
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            toast.success('Product quantity updated in cart');
        } else {
            // Product doesn't exist, add with quantity 1
            const productWithQuantity = { ...product, quantity: 1 };
            setCart([...cart, productWithQuantity]);
            localStorage.setItem('cart', JSON.stringify([...cart, productWithQuantity]));
            toast.success('Product added to cart');
        }
    }

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery}`);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
        getAllProducts();
    }, []);
    
    useEffect(() => {
        if(page==1) return;
        loadMore()
    }, [page]);
    
    return (
        <Layout className='container-fluid' title={"All Products - Best Offers"}>
            <div className='row mt-3'>
            <h1 className='text-center mt-3 mb-4 text-uppercase'>All Products</h1>

                <div className='col-md-12 mb-4'>
                    {/* Active Filters - Using Bootstrap */}
                    <div className="bg-light rounded p-3 mb-3 shadow-sm">
                        <h5 className="me-3 mb-0 d-inline-block">Active Filters:</h5>
                        {selectedCategories.length === 0 && !selectedPrice ? (
                            <span className="text-muted">None</span>
                        ) : (
                            <>
                                {selectedCategories.map(cat => (
                                    <Tag 
                                        key={cat.id}
                                        closable
                                        onClose={() => removeCategoryFilter(cat.id)}
                                        className="me-2 mb-2"
                                        color="blue"
                                    >
                                        Category: {cat.name}
                                    </Tag>
                                ))}
                                
                                {selectedPrice && (
                                    <Tag 
                                        closable
                                        onClose={removePriceFilter}
                                        className="me-2 mb-2"
                                        color="green"
                                    >
                                        Price: {selectedPrice}
                                    </Tag>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                {/* Mobile filter toggle button - Using Bootstrap */}
                <div className='col-md-12 d-md-none mb-3'>
                    <button className="btn btn-primary w-100 mb-3" onClick={toggleFilter}>
                        <i className="fas fa-filter me-2"></i> Show Filters
                    </button>
                </div>

                <div className='row'>
                    {/* Filter Sidebar - Using Bootstrap's col and classes */}
                    <div className='col-lg-3 col-md-4 mb-4'>
                        <div className={`${showFilter ? 'position-fixed start-0 top-0 h-100 w-100 p-3 bg-light' : 'd-none d-md-block'}`} 
                             style={showFilter ? {zIndex: 1050, overflowY: 'auto'} : {position: 'sticky', top: '1rem'}}>
                            
                            <div className="card shadow-sm">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Product Filters</h5>
                                    {showFilter && (
                                        <button type="button" className="btn-close d-md-none" onClick={toggleFilter} aria-label="Close"></button>
                                    )}
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <h6 className="text-uppercase fw-bold">Sort By</h6>
                                        <Select
                                            className="w-100"
                                            placeholder="Sort products"
                                            value={sortBy}
                                            onChange={handleSort}
                                            options={getSortOptions()}
                                        />
                                    </div>
                                    
                                    <hr className="my-3" />
                                    
                                    <div className="mb-3">
                                        <h6 className="text-uppercase fw-bold">Filter By Category</h6>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {categories?.map(c => (
                                                <div key={c._id} className="mb-2">
                                                    <Checkbox 
                                                        checked={tempChecked.includes(c._id)}
                                                        onChange={(e) => handleTempFilter(e.target.checked, c._id, c.slug)}
                                                    >
                                                        <span className="text-capitalize">{c.slug}</span>
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <hr className="my-3" />
                                    
                                    <div className="mb-3">
                                        <h6 className="text-uppercase fw-bold">Filter By Price</h6>
                                        <Radio.Group 
                                            onChange={e => setTempRadio(e.target.value)}
                                            value={tempRadio}
                                        >
                                            {Prices?.map(p => (
                                                <div key={p.id} className="mb-2">
                                                    <Radio value={p.array}>
                                                        <span>{p.name}</span>
                                                    </Radio>
                                                </div>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                    
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={applyFilters}
                                        >
                                            APPLY FILTERS
                                        </button>
                                        
                                        <button 
                                            className="btn btn-outline-secondary"
                                            onClick={resetFilters}
                                        >
                                            RESET FILTERS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Products Grid - Using Bootstrap's col */}
                    <div className='col-lg-9 col-md-8'>
                        <div className='row g-2'>
                            {products?.map(p => (
                                <div key={p._id} className="col-lg-3 col-md-4 col-sm-6 mb-2">
                                    <div className="card h-100 border-0" 
                                         style={{ 
                                             maxWidth: '100%', 
                                             transition: 'all 0.2s', 
                                             cursor: 'pointer',
                                             boxShadow: 'none',
                                             backgroundColor: 'transparent' 
                                         }}
                                         onClick={()=> navigate(`/product/${p.slug}`)}
                                         onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.backgroundColor = '#fff';
                                            e.currentTarget.style.zIndex = '0';
                                         }}
                                         onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.zIndex = 'auto';
                                         }}>
                                        <div className="position-relative">
                                            <img 
                                                src={`http://localhost:8080/api/product-photo/${p._id}`} 
                                                className="card-img-top" 
                                                alt={p.name}
                                                style={{height: "180px", objectFit: "cover"}}
                                            />
                                            {p.quantity < 5 && p.quantity > 0 && (
                                                <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded-pill" style={{fontSize: "0.7rem"}}>
                                                    Only {p.quantity} left
                                                </div>
                                            )}
                                            {p.quantity === 0 && (
                                                <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill" style={{fontSize: "0.7rem"}}>
                                                    Out of stock
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body d-flex flex-column p-2">
                                            <h6 className="card-title text-truncate mb-1 fw-bold">{p.name}</h6>
                                            <p className="card-text text-truncate small mb-1 text-muted">
                                                {p.description?.substring(0, 30)}...
                                            </p>
                                            <p className="card-text text-primary fw-bold mb-2">₹{p.price}</p>
                                            <div className="mt-auto">
                                                <button 
                                                    className="btn btn-sm w-100 btn-primary mb-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(p);
                                                    }}
                                                    disabled={p.quantity === 0}
                                                >
                                                    {p.quantity === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Load More Button - Using Bootstrap */}
                        <div className='text-center mt-4 mb-4'>
                            {products && products.length < total && (
                                <button 
                                    className='btn btn-primary px-4 py-2'
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        setPage(page+1);
                                    }}
                                >
                                    {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...</> : "Load More"}
                                </button>
                            )}
                            <ToastContainer/>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AllProduct
