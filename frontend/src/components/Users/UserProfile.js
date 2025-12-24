import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import UserMenu from './UserMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import axios from 'axios';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const retrievedUserString = localStorage.getItem('user');
        if (retrievedUserString) {
            const retrievedUser = JSON.parse(retrievedUserString);
            const { email, name, address, phone } = retrievedUser;
            setName(name);
            setEmail(email);
            setAddress(address);
            setPhone(phone);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !email || !address || !phone) {
            toast.error('One or more fields are empty.');
            return;
        }
        if (password && password.length <= 5) {
            toast.error('Password must be equal or more than 6 digits.');
            return;
        }

        setIsLoading(true);

        try {
            let response;
            if(password){
            response = await axios.put(
                'http://localhost:8080/api/profile',
                { name, email, password, phone, address },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
        }
            else{
            response = await axios.put(
                'http://localhost:8080/api/profile',
                { name, email, phone, address },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
        }

            const { data } = response;

            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success('Profile updated successfully.', {
                    autoClose: 1000,
                });

                // Update local storage with the new profile data
                const updatedUser = { name, email, phone, address };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container mt-3 bg-light p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <UserMenu />
                </div>
                <div className='col-md-9'>
                    <div className="card login-card" style={{ height: '550px', maxHeight: '550px' }}>
                        <div className="card-header text-center m-2">USER PROFILE</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="col-lg-12 mb-lg-2 position-relative">
                                    <label htmlFor="name" className="login-label form-label">
                                        <i className="fa-solid fa-lg fa-user ps-2 pt-3"></i> Full Name
                                    </label>
                                    <div className="input-group">
                                        <input type="text" className="custom-input form-control" value={name} onChange={(e) => { setName(e.target.value) }} id="name" name="name" required placeholder="Enter name" />
                                    </div> 
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="email" className="login-label form-label">
                                        <i className="fa-solid fa-lg fa-envelope ps-2 pt-3"></i> Email
                                    </label>
                                    <div className="input-group">
                                        <input type="email" className="custom-input form-control" value={email} onChange={(e) => { setEmail(e.target.value) }} id="email" name="email" required placeholder="Enter email" disabled />
                                    </div>
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="password" className="login-label form-label">
                                        <i className="fa-solid fa-lg fa-lock ps-2 pt-3"></i> Password
                                    </label>
                                    <div className="input-group">
                                        <input type="password" className="custom-input form-control" value={password} onChange={(e) => { setPassword(e.target.value) }} id="password" name="password" placeholder="Enter password" />
                                    </div>
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="phone" className="login-label form-label">
                                        <i className="fa-solid fa-lg fa-phone ps-2 pt-3"></i> Phone No.
                                    </label>
                                    <div className="input-group">
                                        <input type="tel" className="form-control" value={phone} onChange={(e) => { setPhone(e.target.value) }} id="phone" name="phone" required placeholder="Enter phone number" />
                                    </div>
                                </div>
 
                                <div className="mb-4 position-relative">
                                    <label htmlFor="address" className="login-label form-label">
                                        <i className="fa-solid fa-lg fa-map-marker-alt ps-2 pt-3"></i> Address
                                    </label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={address} onChange={(e) => { setAddress(e.target.value) }} id="address" name="address" required placeholder="City / Street No. / House No." />
                                    </div>
                                </div>

                                <div className="login-btn mb-3">
                                    <button type="submit" className="col-6 btn btn-warning" disabled={isLoading}>
                                        {isLoading ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                                <ToastContainer />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
