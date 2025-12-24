import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Checkbox, Radio, Input, Button, Select, Card, Divider, Tag } from 'antd';
import Prices from '../Prices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../AllProduct.css';

function CategoryProduct() {
    const [products, setProducts] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [tempChecked, setTempChecked] = useState([]);
    const [tempRadio, setTempRadio] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/category-product/${params.slug}`);
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    }

    // Get All Categories
    const getAllCategory = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/category');
            // Get the main category of the current category
            if (products.length > 0 && products[0].category && products[0].category.mainCategory) {
                setCategories(resp.data?.category.filter(c => 
                    c.mainCategory === products[0].category.mainCategory
                ));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    
    // Toggle filter sidebar visibility for mobile
    const toggleFilter = () => {
        setShowFilter(!showFilter);
    }
    
    // Temporary Filter by Category
    const handleTempFilter = (value, id, categoryName) => {
        let all = [...tempChecked];
        if(value) {
            all.push(id);
            setSelectedCategories(prev => [...prev, {id, name: categoryName}]);
        }
        else {
            all = all.filter(c => c !== id);
            setSelectedCategories(prev => prev.filter(cat => cat.id !== id));
        }
        setTempChecked(all);
    }
    
    // Filter Product
    const productFilter = async (checkedCategories, priceRange) => {
        try {
            const filterCategories = checkedCategories || checked;
            const filterPriceRange = priceRange || radio;
            
            const {data} = await axios.post('http://localhost:8080/api/filter-product', {
                checked: filterCategories, 
                radio: filterPriceRange
            });
            
            // Filter products from the same category
            if (params.slug) {
                setProducts(data?.products.filter(p => p.category.slug === params.slug));
            } else {
                setProducts(data?.products);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    // Handle sort
    const handleSort = (value) => {
        setSortBy(value);
        let sortedProducts = [...products];
        
        if (value === 'price-low') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (value === 'price-high') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (value === 'name-asc') {
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (value === 'name-desc') {
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        
        setProducts(sortedProducts);
    }
    
    // Reset all filters
    const resetFilters = () => {
        setChecked([]);
        setRadio([]);
        setTempChecked([]);
        setTempRadio([]);
        setSortBy('');
        setSelectedCategories([]);
        setSelectedPrice(null);
        
        getProductByCat();
    }
    
    // Apply filters
    const applyFilters = () => {
        let priceLabel = null;
        if (tempRadio.length > 0) {
            const selectedPriceRange = Prices.find(p => 
                JSON.stringify(p.array) === JSON.stringify(tempRadio)
            );
            priceLabel = selectedPriceRange?.name || null;
        }
        
        setChecked(tempChecked);
        setRadio(tempRadio);
        setSelectedPrice(priceLabel);
        
        if (tempChecked.length > 0 || tempRadio.length > 0) {
            productFilter(tempChecked, tempRadio);
        } else {
            getProductByCat();
        }
    }
    
    // Remove category filter
    const removeCategoryFilter = (id) => {
        setSelectedCategories(prev => prev.filter(cat => cat.id !== id));
        setTempChecked(prev => prev.filter(c => c !== id));
        
        const updatedChecked = checked.filter(c => c !== id);
        setChecked(updatedChecked);
        
        if (updatedChecked.length > 0 || radio.length > 0) {
            productFilter(updatedChecked, radio);
        } else {
            getProductByCat();
        }
    }
    
    // Remove price filter
    const removePriceFilter = () => {
        setSelectedPrice(null);
        setTempRadio([]);
        setRadio([]);
        
        if (checked.length > 0) {
            productFilter(checked, []);
        } else {
            getProductByCat();
        }
    }

    // Replace the complex scroll handling effect with a simpler one
    useEffect(() => {
        // Check if we need to adjust the sidebar background based on the theme
        const setFilterBackground = () => {
            const filterSidebar = document.querySelector('.filter-sidebar');
            if (!filterSidebar) return;
            
            // Check if dark mode is active by looking at body class
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                filterSidebar.style.backgroundColor = '#212529';
            } else {
                filterSidebar.style.backgroundColor = '#f8f9fa';
            }
        };
        
        // Run once on mount
        setFilterBackground();
        
        // No need for complex scroll calculations anymore
    }, []);

    useEffect(() => {
        getProductByCat();
    }, [params.slug])

    useEffect(() => {
        if (products.length > 0) {
            getAllCategory();
        }
    }, [products])

    return (
        <div className='container-fluid mt-3 p-3'>
            <div className='row'>
                <h1 className='text-center mt-3 mb-4 text-uppercase'>{params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}</h1>
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
                
                <div className='col-md-12 d-md-none mb-3'>
                    <button className="btn btn-primary w-100 mb-3" onClick={toggleFilter}>
                        <i className="fas fa-filter me-2"></i> Show Filters
                    </button>
                </div>
                
                <div className='row'>
                    {/* Filter Sidebar using Bootstrap's col and position-sticky */}
                    <div className='col-lg-3 col-md-4 mb-4'>
                        <div className={`filter-sidebar position-sticky ${showFilter ? 'show' : 'd-none d-md-block'}`} style={{top: '1rem'}}>
                            <div className="card shadow-sm">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Product Filters</h5>
                                    {showFilter && (
                                        <button type="button" className="btn-close float-end d-md-none" onClick={toggleFilter} aria-label="Close"></button>
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
                                            options={[
                                                { value: 'price-low', label: 'Price: Low to High' },
                                                { value: 'price-high', label: 'Price: High to Low' },
                                                { value: 'name-asc', label: 'Name: A-Z' },
                                                { value: 'name-desc', label: 'Name: Z-A' },
                                            ]}
                                        />
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div className="mb-3">
                                        <h6 className="text-uppercase fw-bold">Filter By Category</h6>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {categories?.map(c => (
                                                <div key={c._id} className="mb-2">
                                                    <Checkbox 
                                                        checked={tempChecked.includes(c._id)}
                                                        onChange={(e) => handleTempFilter(e.target.checked, c._id, c.slug)}
                                                    >
                                                        <span className="text-capitalized">{c.slug}</span>
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div className="mb-3">
                                        <h6 className="text-uppercase fw-bold">Filter By Price</h6>
                                        <Radio.Group 
                                            value={tempRadio}
                                            onChange={e => setTempRadio(e.target.value)} 
                                            className="d-flex flex-column"
                                        >
                                            {Prices?.map(p => (
                                                <div key={p.id} className="mb-2">
                                                    <Radio value={p.array}>{p.name}</Radio>
                                                </div>
                                            ))}
                                        </Radio.Group>
                                    </div>
                                    
                                    <div className="d-grid gap-2">
                                        <Button 
                                            type="primary" 
                                            onClick={applyFilters}
                                            className="w-100 btn-lg"
                                        >
                                            APPLY FILTERS
                                        </Button>
                                        
                                        <Button 
                                            type="default" 
                                            onClick={resetFilters}
                                            className="w-100 btn-lg"
                                        >
                                            RESET FILTERS
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Products Grid */}
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
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.backgroundColor = '#fff';
                                            e.currentTarget.style.zIndex = '1';
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
                                                        // If you have a handleAddToCart function, use it here
                                                        // handleAddToCart(p);
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
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CategoryProduct;