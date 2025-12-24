import { Layout } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from './context/cart'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})
    const [similarProduct, setSimilarProduct] = useState([])
    const [category, setCategory] = useState('')
    const [cart, setCart] = useCart()


    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/get-product/${params.slug}`)
             await setProduct(data?.product)
            await setCategory(data?.product?.category?.name)
            getSimilarProduct(data?.product?._id, data?.product?.category._id)
        } catch (error) {
            console.log(error);
        }
    }
 
    const getSimilarProduct = async (pid,cid) => {
        try {
            const { data } = await axios.post(`http://localhost:8080/api/similar-product/${pid}/${cid}`)
            await setSimilarProduct(data?.products)

        } catch (error) {
            console.log(error);
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
    
    useEffect(() => {
        if (params?.slug) getSingleProduct();
    }, [params?.slug])


    return(
        
    <div className='container '>
            <h1 className='text-center'>Product Details</h1>
            <div className='row '>
                <div className='col-md-4 '>
                    {/* Check if product._id exists before using it */}
                    {product._id && (
                        <img
                            src={`http://localhost:8080/api/product-photo/${product._id}`}
                            className="card-img-top"
                            alt={product.name}
                            style={{}} />
                    )}
                </div>
                <div className='col-md-4'>
                    <h4 style={{ textTransform: "uppercase" }}>
                        {product.name}</h4>
                    <h5>Price: {product.price}</h5>
                    <h6>Description: {product.description}</h6>
                    <h6>Category: {product.category?.mainCategory}</h6> {/* Use optional chaining */}
                </div> 
                <div className='col-md-4'>
                    <button 
                        className='btn btn-warning m-1'
                        onClick={() => handleAddToCart(product)}
                    >
                        Add to Cart
                    </button>
                </div>   
            </div>
            <hr/> 
            <div className='row container'>
                <h2>Similar products</h2>
                {similarProduct.length < 1 && <p>No Similar Products</p>}
            <div className='d-flex flex-wrap justify-content-center'>
                        {similarProduct && similarProduct?.map(p => (
                            <div key={p._id} className="card col-3 m-3 p-0" style={{ width: "18rem", textDecoration: "none" }}>

                                <img src={`http://localhost:8080/api/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: "15rem" }} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h6 className="card-text">{p.description.substring(0,30)}...</h6>
                                    <h5 className="card-text">Rs. {p.price}</h5>
                                    <button 
                                        className='btn btn-warning m-1'
                                        onClick={() => handleAddToCart(p)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                        ))}
                    </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ProductDetails
