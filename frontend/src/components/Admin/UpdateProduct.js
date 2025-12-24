import axios, { toFormData } from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import AdminMenu from './AdminMenu';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select
function UpdateProduct() {
    const navigate = useNavigate();
    const params = useParams();
    const [token, setToken] = useState('');
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [photo, setPhoto] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');
    const [id, setId] = useState('');


// get single Product
const getSingleProduct = async (req,res) =>{
    try {
        
        const {data} = await axios.get(`http://localhost:8080/api/get-product/${params.slug}`)
        setId(data.product._id);
        setName(data.product.name);
        setDescription(data.product.description);
        setCategory(data.product.category._id);
        setPrice(data.product.price);
        setQuantity(data.product.quantity); 
        setShipping(data.product.shipping);  
        
        
    } catch (error) {
        console.log(error);
    }
}
// get all category
    const getAllCategory = async () => {

        try {
            const resp = await axios.get('http://localhost:8080/api/category', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(resp.data.category);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleProductUpdate = async (e) => {
        e.preventDefault();
        console.log(name, description, price, category, quantity, photo, shipping);
        try {
            let formData = { name, description, price, category, quantity, shipping };
            
            // Check if a new photo is provided
            if (photo) {
                formData.photo = photo;
            }
    
            const response = await axios.put(`http://localhost:8080/api/update-product/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
            if (response.status === 201) {
                console.log("Product Updated Successfully");
            } else {
                console.log('Failed to Add Product');
            }
        } catch (error) {
            console.log('Error Adding Product');
        }
    }

// Delete Product

const handleDelete = async ()=>{
    try {
        let answer = window.prompt("Are You Sure ? Type Yes to Confirm")
        if(!answer )
            return
        // Perform the delete action
        await axios.delete(`http://localhost:8080/api/delete-product/${id}`);
        // Navigate here to the all product page
        navigate('/admin/add-product')
        // Redirect to a specific page after successful deletion
       console.log("Deleted Scuccesfully");
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };


    useEffect(() => {
        setToken(localStorage.getItem('token'))
        getAllCategory();
        getSingleProduct();
        // eslint-disable-next-line

    }, []);
  return (
    <div className='container bg-light p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center mb-5'>Update Product</h1>

                    <form onSubmit={handleProductUpdate}><div className='row'>
                        <div className='col-lg-6 col-12'>Category : </div>
                        <div className='col-lg-6 col-12'> <Select variant={false}
                            placeholder="Select a category"
                            size='medium'
                            value={category}
                            showSearch
                            className='form-select mb-3' onChange={(value) => setCategory(value)}>
                            {categories?.map(c => (
                                <Option key={c._id} value={c.id}>{c.slug}</Option>
                            ))}
                            ̥
                        </Select></div>
                        <div className='col-lg-6 col-12'>Name : </div>
                        <div className='col-lg-6 col-12'> <div className='mb-3'>
                            <input type='text'
                                value={name}
                                placeholder='Enter Name'
                                className='form-control'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-6 col-12'>Description : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='text'
                                value={description}
                                placeholder='Enter Description'
                                className='form-control'
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-6 col-12'>Price : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='number'
                                value={price}
                                placeholder='Enter Price'
                                className='form-control'
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-6 col-12'>Quantity : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='number'
                                value={quantity}
                                placeholder='Enter Quantity'
                                className='form-control'
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-6 col-12'>Shipping : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <Select
                                variant={false}
                                placeholder='Select Shipping'
                                value={shipping?  'Yes':'No'}
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                onChange={(value) => {
                                    setShipping(value);
                                }}
                            >
                                <Option value='0'>No</Option>
                                <Option value='1'>Yes</Option>
                            </Select>
                        </div></div>
                        <div className='col-lg-6 col-12'>Photo : </div>
                        <div className='col-lg-6 col-12'>
                            <label
                                className='btn col-12 mb-2 btn-warning'>
                                {photo ? photo.name : "Update Photo"}
                                <input type='file'
                                    name='photo'
                                    accept='image/*'
                                    onChange={(e) => setPhoto(e.target.files[0])} hidden
                                />
                            </label>
                            {photo ? (
                                <div className='text-center'>
                                    <img src={URL.createObjectURL(photo)}
                                        alt='product photo'
                                        height={'250px'}
                                        className='img img-responsive mb-3' />
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <img src={`http://localhost:8080/api/product-photo/${id}`}
                                        alt='product photo'
                                        height={'200px'}
                                        className='img img-responsive mb-3' />
                                </div>
                            )
                            }
                          </div>
                        <button type="submit" className="btn btn-primary mb-2"  >Update</button>
                        <button type="button" className="btn btn-danger" onClick={()=>{handleDelete()}}>Delete</button>

                    </div></form>

                </div>

            </div>





        </div>
  )
}

export default UpdateProduct