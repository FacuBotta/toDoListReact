import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import '../styles/App.css';
import ProtectedRoute from '../routes/ProtectedRoute';
import { useAuth } from './AuthContext';

import Navbar from './Navbar';
import HomePage from '../pages/HomePage';
import UserHome from '../pages/UserHome';

function App() {
  const isAuthStorage = localStorage.getItem('isAuth');
  const { isAuth, user } = useAuth();


  return (
      <div className="App">
        <Navbar isAuth={isAuth} user={user}/>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/Home/:user' element={<ProtectedRoute isAuth={isAuthStorage}> <UserHome /> </ProtectedRoute>} />
          <Route path='*' element={<h1>Not found</h1>} />
        </Routes>
      </div>
  );
}

export default App;
