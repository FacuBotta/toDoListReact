import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../styles/App.css';

import Navbar from './Navbar';
import HomePage from '../pages/HomePage';
import About from '../pages/About'
import UserHome from '../pages/UserHome';

function App() {
  const isAuthStorage = localStorage.getItem('isAuth');
  // const [isAuth, setIsAuth] = useState(isAuthStorage ? true : false);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const handleAuth = (value) => { setIsAuth(value) };
  const handleUser = (user) => { setUser(user) }

  useEffect(() => {
    axios.get('http://localhost:3001/api/isAuth', { withCredentials: true })
      .then((response) => {
        if (response.data.auth) {
          handleAuth(true);
          // setUser(response.data);
          handleUser(response.data);
          localStorage.setItem('isAuth', true);
        } else {
          handleAuth(false);
          setUser(null);
          localStorage.setItem('isAuth', false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])


  return (
    <div className="App">
      <BrowserRouter>
        <Navbar handleAuth={handleAuth} user={user} isLoged={isAuth} />
        <Routes>
          <Route exact path='/' Component={HomePage} />
          <Route exact path='/About' Component={About} />
          <Route exact path='/User-home' element={isAuth || isAuthStorage ? <UserHome /> : <Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;