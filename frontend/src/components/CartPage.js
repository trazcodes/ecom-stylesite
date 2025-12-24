import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useCart } from './context/cart';
import useAdminAuth from '../Common/useAdminAuth';
import { useNavigate, useSearchParams } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
    const [cart, setCart] = useCart();
    const isAdminAuth = useAdminAuth();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const [quantityErrors, setQuantityErrors] = useState({});
    const [productMaxQuantities, setProductMaxQuantities] = useState({});
    const navigate = useNavigate();

    // Retrieve the user object from localStorage
    const retrievedUserString = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Convert the string back to an object using JSON.parse
    const retrievedUser = JSON.parse(retrievedUserString);
    
    const totalPrice = () => {
        try {
            let total = 0
            cart?.map(item => {
                total = total + (item.price * (item.quantity || 1));
            })
            return total;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }
    
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid)
            myCart.splice(index, 1)
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch product's actual quantity from the server
    const fetchProductMaxQuantity = async (productId) => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/product/${productId}`);
            if (data?.product?.quantity) {
                setProductMaxQuantities(prev => ({
                    ...prev,
                    [productId]: data.product.quantity
                }));
            }
        } catch (error) {
            console.error("Error fetching product quantity:", error);
        }
    };

    const handleQuantityChange = (pid, newQuantity, maxQuantity) => {
        if (newQuantity < 1) {
            newQuantity = 1;
        }
        
        // Get the actual max quantity for this product
        const actualMaxQuantity = productMaxQuantities[pid] || maxQuantity;
        
        // Check if quantity exceeds the admin-set limit
        if (actualMaxQuantity && newQuantity > actualMaxQuantity) {
            setQuantityErrors({
                ...quantityErrors,
                [pid]: `Maximum available quantity is ${actualMaxQuantity}`
            });
            newQuantity = actualMaxQuantity; // Don't allow exceeding max
        } else {
            // Clear error if quantity is valid
            const updatedErrors = {...quantityErrors};
            delete updatedErrors[pid];
            setQuantityErrors(updatedErrors);
        }
        
        // Update cart with new quantity
        const updatedCart = cart.map(item => {
            if (item._id === pid) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // get payment gateeway token
    const getToken = async () => {
        try {
            if (!token) return;
            const { data } = await axios.get('http://localhost:8080/api/braintree/token')
            console.log(data.clientToken);

            setClientToken(data?.clientToken)
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        getToken();
        
        // Initialize quantities if not set
        if (cart?.length > 0) {
            const updatedCart = cart.map(item => {
                if (!item.quantity) {
                    return { ...item, quantity: 1 };
                }
                return item;
            });
            
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            
            // Fetch max quantities for all products in cart
            cart.forEach(item => {
                fetchProductMaxQuantity(item._id);
            });
        }
    }, [token]);

    // handle payments
    const handlePayment = () => {
        // Check if any product exceeds available quantity
        const hasErrors = Object.keys(quantityErrors).length > 0;
        if (hasErrors) {
            toast.error("Please correct quantity errors before checkout");
            return;
        }
        
        // Proceed with payment logic here
    }
    
    return (
        <div className="container mt-4">
            <div className="row">
                <div className='col-md-12'>
                    <h1 className='text-center p-2'>
                        {`Hello ${token && retrievedUser?.name}`}
                    </h1>
                    <h4 className='text-center'>
                        {cart?.length > 0
                            ? `You have ${cart.length} items in your cart
                        ${token ? "" : "Please login to proceed"}`
                            : "Your cart is empty"}
                    </h4>
                </div>
                <div className="col-lg-8 col-12">
                    <div className="card">
                        <div className="card-header">Items in Cart</div>
                        {cart?.map(p => (
                            <div className="m-1 card-body row" key={p._id}>
                                <div className="col-lg-2 col-4">
                                    <div className='cart-item-img'>
                                        <img src={`http://localhost:8080/api/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: "6rem" }} />
                                    </div>
                                </div>

                                <div className="col-lg-4 col-8">
                                    <div className="cart-item-name"><h4>{p.name}</h4></div>
                                    <div className="cart-item-desc">{p.description.substring(0, 60)}...</div>
                                    <div className="cart-item-price mt-2"><h5>₹{p.price} each</h5></div>
                                </div>
                                
                                <div className="col-lg-3 col-6">
                                    <div className="quantity-label">Quantity:</div>
                                    <div className="quantity-control">
                                        <button 
                                            onClick={() => handleQuantityChange(p._id, (p.quantity || 1) - 1, p.maxQuantity)}
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            min="1"
                                            max={productMaxQuantities[p._id] || p.maxQuantity}
                                            value={p.quantity || 1}
                                            onChange={(e) => handleQuantityChange(p._id, parseInt(e.target.value), p.maxQuantity)}
                                        />
                                        <button 
                                            onClick={() => handleQuantityChange(p._id, (p.quantity || 1) + 1, p.maxQuantity)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {quantityErrors[p._id] && (
                                        <div className="quantity-error">
                                            {quantityErrors[p._id]}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <button className="btn btn-warning btn-sm" onClick={() => removeCartItem(p._id)}>
                                            <i className="fa-solid fa-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="col-lg-3 col-6 text-center">
                                    <div className="cart-item-name">Subtotal:</div>
                                    <div className="cart-item-price mt-2">
                                        <h4>₹{p.price * (p.quantity || 1)}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col col-lg-4 col-mid-6 col-12">
                    <div className="card summary-card">
                        <div className="card-header">
                            Summary
                        </div>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-6">
                                    <p className="text-left">No. of items</p>
                                </div>
                                <div className="col-1">
                                    <p className="text-left">:</p>
                                </div>
                                <div className="col-5">
                                    <p className="text-right cart-text">{cart.length}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <p className="text-left">Sub-total</p>
                                </div>
                                <div className="col-1">
                                    <p className="text-left">:</p>
                                </div>
                                <div className="col-5">
                                    <p className="text-right cart-text">₹{totalPrice()}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <p className="text-left">Shipping Cost</p>
                                </div>
                                <div className="col-1">
                                    <p className="text-left">:</p>
                                </div>
                                <div className="col-5">
                                    <p className="text-right cart-text">₹0</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-6">
                                    <p className="text-left"><strong>Total</strong></p>
                                </div>
                                <div className="col-1">
                                    <p className="text-left"><strong>:</strong></p>
                                </div>
                                <div className="col-5">
                                    <p className="text-right cart-text"><strong>₹{totalPrice()}</strong></p>
                                </div>
                            </div>
                            <div className='cart-btn'>
                                <button className="btn btn-primary btn-outline-warning text-light" onClick={handlePayment}>
                                    Checkout
                                </button>
                                {token ? (
                                    <>
                                        <div className='mb-3 mt-3'>
                                            <h4>Current Address</h4>
                                            <h5>{retrievedUser.address}</h5>
                                            <button className='btn btn-outline-warning'
                                                onClick={() => navigate('/user/dashboard/profile')}
                                            >Update Address</button>
                                        </div>
                                    </>
                                )
                                    : (
                                        <div className='mb-3 mt-3'>
                                            {
                                                token ? (
                                                    <button className='btn btn-outline-warning'
                                                        onClick={() => navigate('/user/dashboard/profile')}>
                                                        Update Address
                                                    </button>
                                                ) : (
                                                    <button className='btn btn-outline-warning'
                                                        onClick={() => navigate('/login', {
                                                            state: '/cart'
                                                        })}>Please Login to Checkout</button>
                                                )
                                            }
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CartPage;