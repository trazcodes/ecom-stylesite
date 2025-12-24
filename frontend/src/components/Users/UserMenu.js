import React from 'react';
import { NavLink } from 'react-router-dom';

const UserMenu = () => {
  return (
    <div className="text-center mt-3">
      <div className="list-group">
        <h4>User Panel</h4>
        {/* <NavLink to="/admin/manage-products" className="list-group-item list-group-item-action">
          Home </NavLink> */}
        <NavLink to="/user/dashboard/profile" className="list-group-item list-group-item-action">
          Profile</NavLink>
        <NavLink to="/user/dashboard/orders" className="list-group-item list-group-item-action">
          Orders</NavLink>
        
      </div>
    </div>
  );
};

export default UserMenu;
