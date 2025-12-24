import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { isAuth } from '../../Common/auth';
import { isAdminAuth } from '../../Common/AdminAuth';
import useAdminAuth from '../../Common/useAdminAuth';
import AdminMenu from './AdminMenu';


function CreateCategory() {

    const token = localStorage.getItem('token');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedOption, setSelectedOption] = useState('men');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    // CREATE CATEGORY======================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) {
            alert('Please enter a category name');
            return;
        }
        const name = category;
        try {
            await axios.post('http://localhost:8080/api/create-category', { name, mainCategory: selectedOption }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Category created successfully');
            setCategory('');
            getAllCategory();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value); // Update the selected option state
    };
    // =======================================================

    // DELETE CATEGORY=========================================

    const handleDelete = (categoryId) => {
        setDeleteCategoryId(categoryId);
    };

    const handleCancelDelete = () => {
        setDeleteCategoryId(null);
    };

    const handleConfirmDelete = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:8080/api/delete-category/${categoryId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Category deleted successfully');
            getAllCategory(); // Refresh the category list after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };
    // =========================================================


    // UPDATE CATEGORY ========================================
    const handleEdit = (categoryId, categoryName, mainCategoryName) => {
        setEditCategoryId(categoryId);
        setEditCategoryName(categoryName);
    };

    const handleCancelEdit = () => {
        setEditCategoryId(null);
        setEditCategoryName('');
    };

    const handleUpdate = async (categoryId,mainCategory) => {
        try {
            await axios.put(`http://localhost:8080/api/update-category/${categoryId}`, {mainCategory, name: editCategoryName }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Category updated successfully');
            getAllCategory(); // Refresh the category list after update
            setEditCategoryId(null);
            setEditCategoryName('');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };
    // ===================================

    // SHOW CATEGORY LIST
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

    useEffect(() => {
        getAllCategory();

    }, []);
    // ==================

    return (
        <div className='container mt-3 bg-light p-3'>
             <div className='row'>
        <div className='col-md-3'>
            <AdminMenu/>
        </div>
        <div className='col-md-9'>
            <form onSubmit={handleSubmit}>
                <h1 className='text-center mb-5'>Manage Category</h1>
                <div className='row mb-5'>
                    <div className='col-2 hide-mid pt-2'>Category Name:</div>
                    <div className='col-4 col-lg-3'>
                    <select className="form-select" aria-label="Default select example" value={selectedOption} onChange={handleOptionChange}>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                        </select></div>
                    <div className='col-5'>
                        <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Enter category name" aria-label="Category Name" />
                    </div>
                    <div className='col-1'>
                        <button type="submit" className="btn btn-warning">Create</button>
                    </div>
                </div>
            </form>

            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th className='hide-mid'>Category Id</th>
                        <th>Category</th>
                        <th>Name</th>
                        <th className='hide-mid'>Category Slug</th>
                        <th >Update</th>
                        <th >Delete</th>
                    </tr>
                </thead>
                <tbody className='table-group-divider'>
                    {categories.map((cat, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td className='hide-mid'>{cat._id}</td>
                            <td className=''>{cat.mainCategory}</td>
                            <td>
                                {editCategoryId === cat._id ? (
                                    <input className='col-12'
                                        type="text"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                    />
                                ) : (
                                    cat.name
                                )}
                            </td>
                            <td className='hide-mid'>{cat.slug}</td>
                            <td>
                                {editCategoryId === cat._id ? (
                                    <>
                                        <button className="btn btn-success btn-sm " onClick={() => handleUpdate(cat._id, cat.mainCategory)}>Save</button>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <i className=" table-item-edit fa-solid fa-pencil-alt fa-lg" onClick={() => handleEdit(cat._id, cat.name)}></i>
                                )}
                            </td>
                            <td>
                                {deleteCategoryId === cat._id ? (
                                    <>
                                        <button className="btn btn-danger btn-sm " onClick={() => handleConfirmDelete(cat._id)}>Delete</button>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCancelDelete}>Cancel</button>
                                    </>
                                ) : (
                                    <i className=" table-item-delete fa-solid fa-trash-can fa-lg" onClick={() => handleDelete(cat._id)}></i>
                                )}
                            </td>
                        </tr>
                    ))}

                </tbody>

            </table>

        </div></div></div>
    );
}

export default CreateCategory;
