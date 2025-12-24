import React, { useEffect, useState } from 'react';
import AdminMenu from './AdminMenu';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminAllProducts() {
    const token = localStorage.getItem('token');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)

    const getTotal = async () => {
        try { 
            const resp = await axios.get('http://localhost:8080/api/count-product', {
            });
            setTotal(resp?.data?.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
     // load more
     const loadMore = async ()=>{
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
    // Get All Products
    const getAllProducts = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/get-product', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProducts(resp.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    useEffect(() => {
        
        getAllProducts();
        getTotal();
    }, []);
    useEffect(() => {
        if(page==1) return;
        loadMore()
    }, [page]);
    return (
        <div className='container mt-3 bg-light p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9 justify-content-center text-center row'>
                    <h1 className='text-center'>All Products List</h1>
                    {products.map(p => (
                        <Link  key={p._id} to={`/admin/product/${p.slug}`} className="card col-3 m-3 p-0" style={{ width: "15rem" , textDecoration: "none"}}>
                            <div>
                                <img src={`http://localhost:8080/api/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: "15rem" }}/>
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h6 className="card-text">{p.description}</h6>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className=' m-2 p-3'>
                        {products && products.length <total &&(
                            <button className=' col-12 btn btn-outline-secondary' 
                            onClick={(e)=>{
                                e.preventDefault()
                                setPage(page+1);
                            
                            }}>
                                {loading ? "Loading ..." : "Load more"}
                            </button>
                        )}</div>
                </div>
            </div>
        </div>
    );
}

export default AdminAllProducts;
