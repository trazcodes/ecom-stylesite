import React, { useEffect, useState } from 'react';
import './Login.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import photo1 from '../img/photo1.png';
import photo2 from '../img/photo3.png';
import photo3 from '../img/photo4.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { isAuth } from '../Common/auth';
import API from '../utils/api';


const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        try {
            const response = await API.post('/api/login', { email, password });
            // IF SUCCESS, STORE TOKEN IN LOCAL STORAGE
            if (response.status === 200) {
                const { user, token } = response.data.result;
                console.log(user, token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                toast.success('Logged in Successfully.', {
                    autoClose: 1000,
                    onClose: () => window.location.replace('/home')
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
    }


    const handlePassword = (event) => {
        setPassword(event.target.value);

    };

    useEffect(() => {
        if (isAuth()) {
            navigate('/user/cart')
        }
    }, [])


    const settings = {
        autoplay: true,
        autoplaySpeed: 2500,
        dots: false,
        infinite: true,
        slidesToShow: 1,   // 👈 IMPORTANT
        slidesToScroll: 1,
        speed: 600,
        arrows: false,     // 👈 PROPER way to hide arrows
        pauseOnHover: false,
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
                <div className='col-lg-9 row p-5 mb-3' style={{ backgroundColor: ' #E27D60' }}>
                    <div className="col-lg-7 col-md-12 col-sm-12 login-body p-0" ref={handleSliderRef} style={{ backgroundColor: "" }}>
                        <Slider {...settings} className="">
                            <div className='col-lg-3'><img src={photo1} className='login-slick-img' /></div>
                            <div className='col-lg-3'><img src={photo2} className='login-slick-img' /></div>
                            <div className='col-lg-3'><img src={photo3} className='login-slick-img' /></div>

                        </Slider>
                    </div>
                    <div className="login-form col-lg-5 col-md-12 col-sm-12 mr-0">
                        <div className="card login-card" style={{ height: '500px' }}>
                            <div className="card-header text-center m-2">
                                Login Account
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4 position-relative">
                                        <label htmlFor="email" className="login-label form-label"><i className="fa-solid fa-lg fa-envelope ps-2 pt-3"></i> Email</label>
                                        <div className="input-group">
                                            <input type="email" className="form-control" value={email} id="email" onChange={(e) => { setEmail(e.target.value) }} name="email" required placeholder="Enter email" />

                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label"><i className="fa-solid fa-lg fa-lock ps-2 pt-3"></i> Password</label>
                                        <input type="password" className="form-control" id="password" name="password" required placeholder="Enter Password" onChange={handlePassword} />
                                    </div>

                                    <div className="login-btn mb-3">
                                        <button type="submit" className="btn btn-warning">Login</button>
                                    </div>
                                </form>

                                <div className="login-small mb-2">OR</div>
                                <div className="login-small">Forgot Password?</div>
                                <div className="login-small">Don't have an Account? <span onClick={() => { window.location.replace('/register') }}>Register Now</span></div>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
