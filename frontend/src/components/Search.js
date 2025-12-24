import { Layout } from 'antd'
import React from 'react'
import { useSearch } from './context/search'
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/cart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart([]);

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

    return (
        <Layout title={'Search Results'}>
            <div className='container'>
                <h1 className='text-center mt-3 mb-4 text-uppercase'>Search Results</h1>
                
                <div className='text-center'>
                    <h6 className='mb-4'>{values?.results.result.length < 1 ? `No Products Found` : `Found ${values?.results.result.length} Products`}</h6>
                    
                    <div className='row g-2 justify-content-center'>
                        {values?.results.result.map(p => (
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
                </div>
                <ToastContainer />
            </div>
        </Layout>
    )
}

export default Search