import '../styles/App.css';
import navLogo from '../assets/navLogo.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LogForm from './LogForm';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [isLoged, setIsLoged] = useState(false)
    const open = () => setFormOpen(true);
    const close = () => setFormOpen(false);
    
    const defLoging = (data) => { 
        console.log(data);
        setIsLoged(!isLoged)
    }

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
                    <Link to="/"><HomeIcon/></Link>
                    {!isLoged ? (
                        <motion.button onClick={() => (formOpen ? close() : open())}><LoginIcon/></motion.button>
                    ) : (
                        <button><LogoutIcon/></button>
                    )}
                            <AnimatePresence
                                initial={false}
                                mode='wait'
                                onExitComplete={() => null}
                            >
                                {formOpen && (
                                    <LogForm
                                        key={formOpen ? 'open' : 'closed'}
                                        formOpen={formOpen}
                                        handleClose={close}
                                        defLoging={defLoging}
                                    />
                                )}
                            </AnimatePresence>
                            <Link to="/About">About</Link>
                        </div>
            </header>
        </>
    )
}

export default Navbar
