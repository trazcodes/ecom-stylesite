import React, { useEffect, useState } from 'react';
import './Login.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import photo1 from '../img/photo1.png';
import photo2 from '../img/photo3.png';
import photo3 from '../img/photo4.png';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';



const Register = () => {
    const [name,setName]= useState('');
    const [email,setEmail]= useState('');
    const [password,setPassword]= useState('');
    const [phone,setPhone]= useState('');
    const [address,setAddress]= useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
    if(!name||!password||!email||!address||!phone){
        toast.error('One or more fiels are empty.');
        return;
    }
    try {
        const response = await axios.post('http://localhost:8080/api/signup', {name, email, password, phone, address});
        // IF SUCCESS, STORE TOKEN IN LOCAL STORAGE
        if (response.status === 200) {
          toast.success('Logged in Successfully.', {
            autoClose: 1000,
            onClose: () => window.location.replace('/login')
          });
        } else {
          toast.error('Failed to login. Please try again later.');
        }
      } catch (error) {
        // IF INVALID CREDENTIALS
        if (error.response && error.response.status === 401) {
          toast.error('Invalid credentials. Please check your email and password.');
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      }

    };

    const settings = {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        prevArrow: null,
        nextArrow: null,
        responsive: [
            {
                breakpoint: 992, // Medium devices (tablets, less than 992px)
                settings: {
                    slidesToShow: 2, // Show 3 slides at a time
                    slidesToScroll: 1, // Show 3 slides at a time
                }
            },
            {
                breakpoint: 576, // Small devices (phones, less than 576px)
                settings: {
                    slidesToShow: 1, // Show 1 slide at a time
                    slidesToScroll: 1, // Show 1 slide at a time
                }
            }
        ]
    };
    const handleSliderRef = (slider) => {
        if (slider) {
            const prevArrow = slider.querySelector('.slick-prev');
            const nextArrow = slider.querySelector('.slick-next');
            if (prevArrow && nextArrow) {
                prevArrow.style.display = 'none'; // Hide the previous arrow
                nextArrow.style.display = 'none'; // Hide the next arrow
            }
        }
    };

    return (
        <div className="container mt-5 ">
            <div className="row justify-content-center ">
                <div className='col-lg-10 row p-4 register-card' >
                    <div className="col-lg-6 col-md-12 col-sm-12 m-0 login-body p-0" ref={handleSliderRef}> </div>
                    <div className="login-form col-lg-6 col-md-12 col-sm-12 mt-0">
                        {/* Registration Card */}
                        <div className="card login-card" style={{ height: '550px', maxHeight: '550px' }}>
                            <div className="card-header text-center m-2">Register Now</div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                   
                                    {/* FULL NAME */}
                                    <div className="col-lg-12 mb-lg-2 position-relative">
                                        <label htmlFor="name" className="login-label form-label"><i className="fa-solid fa-lg fa-envelope ps-2 pt-3"></i>Full Name</label>
                                        <div className="input-group">
                                            <input type="name" className="custom-input form-control" value={name} onChange={(e)=>{setName(e.target.value)}} id="name" name="name" required placeholder="Enter name" />
                                            <div className="input-icon">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* EMAIL */}
                                    <div className="mb-2 position-relative">
                                        <label htmlFor="email" className="login-label form-label"><i className="fa-solid fa-lg fa-envelope ps-2 pt-3"></i> Email</label>
                                        <div className="input-group">
                                            <input type="email" className="custom-input form-control" value={email} onChange={(e)=>{setEmail(e.target.value)}} id="email" name="email" required placeholder="Enter email" />
                                        </div>
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="mb-2 position-relative">
                                        <label htmlFor="password" className="login-label form-label"><i className="fa-solid fa-lg fa-lock ps-2 pt-3"></i> Password</label>
                                        <div className="input-group">
                                            <input type="password" className="custom-input form-control" value={password} onChange={(e)=>{setPassword(e.target.value)}} id="password" name="password" required placeholder="Enter password" />
                                        </div>
                                    </div>

                                    {/* PHONE */}
                                    <div className="mb-2 position-relative">
                                        <label htmlFor="phone" className="login-label form-label"><i className="fa-solid fa-lg fa-lock ps-2 pt-3"></i> Phone No.</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" value={phone} onChange={(e)=>{setPhone(e.target.value)}} id="phone" name="phone" required placeholder="Enter phone number" />
                                        </div>
                                    </div>

                                    {/* ADDRESS */}
                                    <div className="mb-4 position-relative">
                                        <label htmlFor="address" className="login-label form-label"><i className="fa-solid fa-lg fa-lock ps-2 pt-3"></i> Address
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={address} onChange={(e)=>{setAddress(e.target.value)}} id="address" name="address" required placeholder="City / Street No. / House No." />
                                        </div>
                                    </div>

                                    {/* REGISTER BUTTON */}
                                    <div className="login-btn mb-3">
                                        <button type="submit" className=" col-6 btn btn-warning">Register</button>
                                        <span className='login-small'> OR Login</span>
                                    </div>
                                    <ToastContainer/>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
