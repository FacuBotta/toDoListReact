import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../styles/App.css';

import Navbar from './Navbar';
import HomePage from '../pages/HomePage';
import LogPage from '../pages/LogPage'
import About from '../pages/About'
import UserHome from '../pages/UserHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' Component={HomePage}/>
          <Route exact path='/Log-in' Component={LogPage}/>
          <Route exact path='/About' Component={About}/>
          <Route exact path='/User-home' Component={UserHome}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
