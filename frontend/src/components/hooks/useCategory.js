import axios from 'axios';
import React, { useEffect, useState } from 'react'

function useCategory() {
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState([]);

    // get Category
    const  getAllCategory = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/category', );
            setCategories(resp.data?.category);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }  
    };
    useEffect(()=>{
        getAllCategory();
    },[]);

    return categories;
}

export default useCategory;