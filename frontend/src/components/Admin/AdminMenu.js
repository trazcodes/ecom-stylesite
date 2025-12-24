import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <div className="text-center mt-3">
      <div className="list-group">
        <h4>Admin Panel</h4>
        {/* <NavLink to="/admin/manage-products" className="list-group-item list-group-item-action">
          Home </NavLink> */}
        <NavLink to="/admin/manage-products" className="list-group-item list-group-item-action">
          Manage Products</NavLink>
        <NavLink to="/admin/create-product" className="list-group-item list-group-item-action">
          Create Products</NavLink>
          <NavLink to="/admin/create-category" className="list-group-item list-group-item-action">
          Manage Categories</NavLink>
        
      </div>
    </div>
  );
};

export default AdminMenu;
