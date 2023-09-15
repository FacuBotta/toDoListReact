import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, children}) => {
    if(!isAuth) {
        return <Navigate to='/Home' />
    }
    return children;
};

export default ProtectedRoute;