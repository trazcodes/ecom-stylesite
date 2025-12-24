import React from 'react'
import { Button, Form, FormControl } from 'react-bootstrap'
import { useSearch } from '../context/search'
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

const Searchinput = () => {
  const [values, setValues] = useSearch()
  const navigate = useNavigate()
  const handleSubmit = async (e)=>{
    try {
      e.preventDefault();
      const {data} = await axios.get(`http://localhost:8080/api/search-product/${values.keyword}`)
      setValues({...values, results: data})
    
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
    
  }


  return (
    <Form onSubmit={handleSubmit} className='m-0 d-flex col-6 justify-content-center'>
      <FormControl
      type="search"
      placeholder="  Search..."
      aria-label="Search"
      value={values.keyword}
      onChange={(e)=>{setValues({...values, keyword: e.target.value})}}
      style={{ borderRadius: '50px 0px 0px 50px', width: '60%' }} />
    <Button
      variant=" bg-warning ms-0 outline-dark"
      type="submit"
      style={{ borderRadius: '0px 50px 50px 0px', width: '50%', minWidth: '25px', maxWidth: '60px' }}>
      <i className="ms-0 fa-solid fa-magnifying-glass fa-md"></i>
    </Button>
    </Form>
    
  )
}

export default Searchinput  