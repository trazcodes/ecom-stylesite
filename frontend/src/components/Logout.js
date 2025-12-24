import React from 'react';

function Logout() {
//CLEAR STORAGE IF USER LOGGED IN AND REDIRECT
  const token = localStorage.getItem('token');
  const handleLog = () => {
    if (token != null) {
      localStorage.clear();
      window.location.replace("/login");
    }
    // IF UNAUTHORIZED VISITING
    else {
      alert("User Not Logged In")
    }
  }
  const goto = () => {
    window.location.replace("/home");

  }

  return (
    <div className='mt-5 container text-center' >
      <h1 >Are You Sure?</h1>
      <button type="submit" onClick={handleLog} className=" me-2 btn btn-success">yes</button>
      <button type="submit" onClick={goto} className=" btn btn-danger">No</button>
    </div>
  )
}

export default Logout;