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
import { capitalizeFirstLetter } from '../utils/helpers';

const Navbar = ({ handleAuth, user, isLoged }) => {
    console.log(user, isLoged)
    const navigate = useNavigate();
    const dropMenuRef = useRef();
    const [formOpen, setFormOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false)
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);

    const handleLogOut = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/logOut', null, { withCredentials: true })
            .then((response) => {
                console.log(response)
                if (response.data.logout) {
                    localStorage.setItem('isAuth', false);
                    handleAuth(false)
                    setMenuOpen(false)
                    navigate('/');
                } else {
                    console.log('already log out')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const handleDeleteUser = (e) => {
        e.preventDefault()
        const userConfirmed = window.confirm('Are you really sure to want to delete your account?');
        if (userConfirmed) {
            axios.get('http://localhost:3001/api/deleteUser', {
                withCredentials: true
            })
                .then((response) => {
                    window.alert(response.data.message)
                    localStorage.setItem('isAuth', false);
                    handleAuth(false)
                    setMenuOpen(false)
                    navigate('/');
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            setMenuOpen(false)
        }
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
                    {isLoged && user ? (
                        <h2>Hi {capitalizeFirstLetter(user.userName) + "!"}</h2>
                    ) : (
                        <h2>Let's do some tasks!</h2>
                    )}
                </div>
                <div className='nav-links'>
                    <Link to="/"><HomeIcon /></Link>
                    {!isLoged ? (
                        <motion.button onClick={() => (formOpen ? close() : open())}><LoginIcon /></motion.button>
                    ) : (
                        <>
                            <button className='menu-trigger' onClick={(e) => handleMenu(e)}><AccountBoxIcon /></button>
                            {menuOpen && <DropMenu ref={dropMenuRef} handleLogOut={handleLogOut} handleDeleteUser={handleDeleteUser} handleMenu={handleMenu} />}
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
                                handleAuth={handleAuth}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </header>
        </>
    )
}

export default Navbar
