import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox, Radio, Input, Button, Select, Card, Divider, Tag } from 'antd';
import Prices from '../../Prices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function KidsProducts() {
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
            setProducts(resp.data.products.filter(p => p.category.mainCategory === 'kids'));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    
    // Get All Categories
    const getAllCategory = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/category');
            setCategories(resp.data?.category.filter(c => c.mainCategory === 'kids'));
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
            
            setProducts(data?.products.filter(p => p.category.mainCategory === 'kids'));
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
            productFilter(tempChecked, tempRadio);
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
            productFilter(updatedChecked, radio);
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
            productFilter(checked, []);
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
                    <h1 className='text-center'>Kids Collection</h1>
                    <div className="active-filters d-flex flex-wrap align-items-center">
                        <h5 className="me-3 mb-0">Active Filters:</h5>
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
                    <button className="filter-toggle-btn" onClick={toggleFilter}>
                        <i className="fas fa-filter"></i> Show Filters
                    </button>
                </div>
                
                <div className={`col-md-3 col-lg-2 filter-sidebar ${showFilter ? 'show' : ''}`}>
                    <div className="filter-inner">
                        <button className="filter-close-btn d-md-none" onClick={toggleFilter}>
                            <i className="fas fa-times"></i>
                        </button>
                        <Card title="Product Filters" className="mb-4 p-2" bordered={true}>                        
                            <div className="mb-3">
                                <h5 className="text-uppercase font-semibold">Sort By</h5>
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
                                <h5 className="text-uppercase font-semibold">Filter By Category</h5>
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
                                <h5 className="text-uppercase font-semibold">Filter By Price</h5>
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
                            
                            <Button 
                                type="primary" 
                                onClick={applyFilters}
                                className="w-100 mt-3 mb-3 btn-lg"
                            >
                                APPLY FILTERS
                            </Button>
                            
                            <Button 
                                type="default" 
                                onClick={resetFilters}
                                className="w-100 mb-3 btn-lg"
                            >
                                RESET FILTERS
                            </Button>
                        </Card>
                    </div>
                </div>
                
                <div className='col-md-9 col-lg-10'>
                    <div className='row justify-content-center'>
                        {products.map(p => (
                            <div key={p._id} className="col-md-4 col-sm-6 mb-4">
                                <div className="product-card">
                                    <div className="image-container">
                                        <img 
                                            src={`http://localhost:8080/api/product-photo/${p._id}`} 
                                            className="card-img-top" 
                                            alt={p.name} 
                                        />
                                        <div className="quick-view" onClick={() => navigate(`/product/${p.slug}`)}>
                                            <i className="fas fa-eye"></i>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <h5 className="price">₹{p.price}</h5>
                                        <div className="card-actions">
                                            <button 
                                                className='btn-cart'
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                VIEW DETAILS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default KidsProducts;
