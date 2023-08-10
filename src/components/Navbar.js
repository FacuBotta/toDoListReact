import '../styles/App.css';
import navLogo from '../assets/navLogo.png';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import LoginIcon from '@mui/icons-material/Login';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import DropMenu from './DropMenu';

const Navbar = () => {
    const navigate = useNavigate();
    const dropMenuRef = useRef();
    const [formOpen, setFormOpen] = useState(false);
    const [isLoged, setIsLoged] = useState(false);
    const [user, setUser] = useState('');
    const [menuOpen, setMenuOpen] = useState(false)
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);
    const isUserLoged = () => setIsLoged(true);
    useEffect(() => {
        axios.get('http://localhost:3001/api/isAuth', { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                if (response.data.auth) {
                    setIsLoged(true);
                    setUser(response.data)
                } else {
                    setIsLoged(false);
                    navigate('/');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [isLoged])

    const handleLogOut = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/logOut', null, { withCredentials: true })
            .then((response) => {
                console.log(response)
                if (response.data.logout) {
                    setIsLoged(false);
                    setMenuOpen(false)
                    setUser('');
                    navigate('/');
                } else {
                    console.log('already log out')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const handleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    }
    
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropMenuRef.current && !dropMenuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <>
            <header className='navbar'>
                <div className='nav-logo'>
                    <img src={navLogo} />
                </div>
                <div className='nav-title'>
                    <h1>Hi! {isLoged ? user.userName : 'to do staffs'}</h1>
                </div>
                <div className='nav-links'>
                    <Link to="/"><HomeIcon /></Link>
                    {!isLoged ? (
                        <motion.button onClick={() => (formOpen ? close() : open())}><LoginIcon /></motion.button>
                    ) : (
                        <>
                            <button className='menu-trigger' onClick={(e) => handleMenu(e)}><AccountBoxIcon /></button>
                            {menuOpen && <DropMenu ref={dropMenuRef} handleLogOut={handleLogOut} handleMenu={handleMenu} />}
                        </>
                    )}
                    <AnimatePresence
                        initial={false}
                        mode='wait'
                        onExitComplete={() => null}
                    >
                        {formOpen && (
                            <UserForm
                                key={formOpen ? 'open' : 'closed'}
                                formOpen={formOpen}
                                handleClose={close}
                                isUserLoged={isUserLoged}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </header>
        </>
    )
}

export default Navbar
