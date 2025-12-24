import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminMenu from './AdminMenu';


const { Option } = Select;

function CreateProduct() {
    const navigate = useNavigate();

    const [token, setToken] = useState('');
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [photo, setPhoto] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shipping, setShipping] = useState('');

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        getAllCategory();
    }, []);

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

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !price || !category || !quantity || !photo || !shipping) {
            toast.error('One or more fields are empty');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('quantity', quantity);
            formData.append('shipping', shipping);
            formData.append('photo', photo);

            const response = await axios.post('http://localhost:8080/api/create-product', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                toast.success('Logged in Successfully.', {
                    autoClose: 2000,
                    onClose: () => navigate('/admin/products')
                  });
                
            } else {
                toast.error('Failed to Add Product');
            }
        } catch (error) {
            console.log('Error Adding Product');
        }
    };
    // ==================

    return (
        <div className='container mt-3 bg-light p-3'>

            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center mb-5'>Add Product</h1>

                    <form onSubmit={handleProductSubmit}><div className=' justify-content-center row'>
                        <div className='col-lg-4 col-12'>Category : </div>
                        <div className='col-lg-6 col-12'> <Select variant={false}
                            placeholder="Select a category"
                            size='medium'
                            showSearch
                            className='form-select mb-3' onChange={(value) => setCategory(value)}>
                            {categories?.map(c => (
                                <Option key={c._id} value={c.id}>{c.slug}</Option>
                            ))}
                            ̥
                        </Select></div>
                        <div className='col-lg-4 col-12'>Name : </div>
                        <div className='col-lg-6 col-12'> <div className='mb-3'>
                            <input type='text'
                                value={name}
                                placeholder='Enter Name'
                                className='form-control'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-4 col-12'>Description : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='text'
                                value={description}
                                placeholder='Enter Description'
                                className='form-control'
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-4 col-12'>Price : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='number'
                                value={price}
                                placeholder='Enter Price'
                                className='form-control'
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-4 col-12'>Quantity : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <input type='number'
                                value={quantity}
                                placeholder='Enter Quantity'
                                className='form-control'
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div></div>
                        <div className='col-lg-4 col-12'>Shipping : </div>
                        <div className='col-lg-6 col-12'><div className='mb-3'>
                            <Select
                                variant={false}
                                placeholder='Select Shipping'
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
                        <div className='col-lg-4 col-12'>Photo : </div>
                        <div className='col-lg-6 col-12'>
                            <label
                                className='btn col-12 mb-2 btn-warning'>
                                {photo ? photo.name : "Upload Photo"}
                                <input type='file'
                                    name='photo'
                                    accept='image/*'
                                    onChange={(e) => setPhoto(e.target.files[0])} hidden
                                />
                            </label>
                            {photo && (
                                <div className='text-center'>
                                    <img src={URL.createObjectURL(photo)}
                                        alt='product photo'
                                        height={'250px'}
                                        className='img img-responsive mb-3' />
                                </div>
                            )}



<ToastContainer/>


                        </div>





                        <button type="submit" className="btn btn-outline-primary"  >Create</button>

                    </div></form>

                </div>

            </div>





        </div>
    )
}

export default CreateProduct