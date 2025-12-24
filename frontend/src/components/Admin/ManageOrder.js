import React from 'react';
import AdminMenu from './AdminMenu';
import "./AdminDashboard.css"
function ManageOrder() {
  return (
    <div className='container mt-3 bg-light p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            content
          </div>
        </div>

      </div>
  )
}

export default ManageOrder