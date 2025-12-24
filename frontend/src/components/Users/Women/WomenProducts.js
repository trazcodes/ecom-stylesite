import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Radio, Button as AntButton, Select, Card as AntCard, Divider, Tag } from 'antd';
import Prices from '../../Prices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { productFilter, sortProducts, handleCategoryFilter, getSortOptions } from '../../../utils/filter';

function WomenProducts() {
    const [products, setProducts] = useState([]);
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
    
    // Get All Products
    const getAllProducts = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/get-product');
            setProducts(resp.data.products.filter(p => p.category.mainCategory === 'women'));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    
    // Get All Categories
    const getAllCategory = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/category');
            setCategories(resp.data?.category.filter(c => c.mainCategory === 'women'));
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
        const result = handleCategoryFilter(value, id, categoryName, tempChecked, selectedCategories);
        setTempChecked(result.checked);
        setSelectedCategories(result.selected);
    }
    
    // Filter Products
    const applyProductFilter = async (checkedCategories, priceRange) => {
        try {
            const filteredProducts = await productFilter(checkedCategories, priceRange, 'women');
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
        setChecked([]);
        setRadio([]);
        setTempChecked([]);
        setTempRadio([]);
        setSortBy('');
        setSelectedCategories([]);
        setSelectedPrice(null);
        
        getAllProducts();
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
            applyProductFilter(tempChecked, tempRadio);
        } else {
            getAllProducts();
        }
    }
    
    // Remove category filter
    const removeCategoryFilter = (id) => {
        setSelectedCategories(prev => prev.filter(cat => cat.id !== id));
        setTempChecked(prev => prev.filter(c => c !== id));
        
        const updatedChecked = checked.filter(c => c !== id);
        setChecked(updatedChecked);
        
        if (updatedChecked.length > 0 || radio.length > 0) {
            applyProductFilter(updatedChecked, radio);
        } else {
            getAllProducts();
        }
    }
    
    // Remove price filter
    const removePriceFilter = () => {
        setSelectedPrice(null);
        setTempRadio([]);
        setRadio([]);
        
        if (checked.length > 0) {
            applyProductFilter(checked, []);
        } else {
            getAllProducts();
        }
    }
    
    useEffect(() => {
        getAllProducts();
        getAllCategory();
    }, []);

    return (
        <div className='container-fluid mt-3 p-3'>
            <div className='row'>
                <div className='col-md-12 mb-4'>
                    <h1 className='text-center'>Women's Collection</h1>
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
                                            <div key={p._id} className="mb-2">
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
                
                <div className='col-lg-9 col-md-8'>
                    <div className='row'>
                        {products?.map(p => (
                            <div className='col-md-4 col-lg-3 mb-4' key={p._id}>
                                <div className='card h-100 product-card'>
                                    <div className="position-relative">
                                        <img 
                                            src={`http://localhost:8080/api/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                            style={{height: "200px", objectFit: "cover"}}
                                        />
                                        <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 text-center user-select-none" 
                                             style={{transform: "translateY(100%)", transition: "transform 0.3s ease", cursor: "pointer"}}
                                             onClick={() => navigate(`/product/${p.slug}`)}
                                             onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(0)"}
                                             onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(100%)"}>
                                            <i className="fas fa-eye me-2"></i>Quick View
                                        </div>
                                    </div>
                                    <div className='card-body d-flex flex-column'>
                                        <h5 className='card-title text-truncate'>{p.name}</h5>
                                        <p className='card-text text-truncate'>
                                            {p.description?.substring(0, 30)}...
                                        </p>
                                        <h5 className='card-text text-primary fw-bold'>₹ {p.price}</h5>
                                        <div className='mt-auto d-grid gap-2'>
                                            <Link to={`/product/${p.slug}`} className='btn btn-primary'>
                                                More Details
                                            </Link>
                                            <button className='btn btn-outline-secondary'>
                                                ADD TO CART
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
    );
}

export default WomenProducts;
