//rafc para armar el esqueleto rapido
import '../styles/App.css';
import navLogo from '../assets/navLogo.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

    return (
        <>
            <header className='navbar'>
                    <div className='nav-logo'>
                        <img src={navLogo} />
                    </div>
                    <div className='nav-title'>
                        <h1>Hi! to do staffs</h1>
                    </div>
                    <div className='nav-links'>
                        <Link to="/">Home</Link>
                        <Link to="/Log-in">Log/Sign-In</Link>
                        <Link to="/About">About</Link>
                    </div>
            </header>
        </>
    )
}

export default Navbar
