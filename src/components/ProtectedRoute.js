import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            element={isAuth ? <Component /> : <Navigate to="/" replace />}
        />
    );
};

export default ProtectedRoute;