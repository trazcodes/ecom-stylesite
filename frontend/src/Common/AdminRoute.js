import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAdminAuth } from './AdminAuth'

// MAKING ROUTES PRIVATE(ONLY AVAILABLE AFTER LOGIN)
function AdminRoute() {
    return isAdminAuth()? <Outlet/> : <Navigate to={'/login'}/>
}

export default AdminRoute;