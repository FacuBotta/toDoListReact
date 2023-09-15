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
import DropMenu from './DropMenu';
import { capitalizeFirstLetter } from '../utils/helpers';
import { useAuth } from './AuthContext';

const Navbar = ({ isAuth, user }) => {

    const { logout, delUser } = useAuth();
    // console.log(user, isAuth)
    const navigate = useNavigate();
    const dropMenuRef = useRef();
    const [formOpen, setFormOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false)
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);

    const handleLogOut = async (e) => {
        e.preventDefault();
        await logout()
        setMenuOpen(false)
        navigate('/Home');
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault()
        const userConfirmed = window.confirm('Are you really sure to want to delete your account?');
        if (userConfirmed) {
                await delUser();
                setMenuOpen(false)
                navigate('/Home');
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
                    {isAuth && user != null ? (
                        // <h2>Hi {capitalizeFirstLetter(user.userName) + "! 👋"  }</h2>
                        <h2>Hi {user.userName} ! 👋</h2>
                        ) : (
                        <h2>Let's do some tasks! 💪 </h2>
                    )}
                </div>
                <div className='nav-links'>
                    <Link to="/Home"><HomeIcon /></Link>
                    {!isAuth ? (
                        <motion.button onClick={() => (formOpen ? close() : open())}><LoginIcon /></motion.button>
                    ) : (
                        <>
                            <button className='menu-trigger' onClick={(e) => handleMenu(e)}><AccountBoxIcon /></button>
                            {menuOpen && <DropMenu ref={dropMenuRef} user={user.userName} handleLogOut={handleLogOut} handleDeleteUser={handleDeleteUser} handleMenu={handleMenu} />}
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
                                // handleAuth={handleAuth}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </header>
        </>
    )
}

export default Navbar
