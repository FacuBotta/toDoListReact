import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Backrop from './Backrop';


const LogForm = ( { handleClose, defLoging} ) => {
    const navigate = useNavigate();
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                userName: loginUserName,
                password: loginPassword,
            }, { withCredentials: true });
            console.log(response.data)
            localStorage.setItem('token', response.data.token)
            // defLoging(response.data);
            navigate('/User-home');
        } catch (error) {
            console.error(error);
        }
    };
//agregar execto mas copado para el exit.
    const dropIn = {
        hidden: {
            x: '100vh',
            opacity: 0,
        },
        visible: {
            opacity: 1,
            x: '0',
            transition: {
                duration: 0.1,
                type: 'spring',
                damping: 25,
                stiffness: 500,
            }
        },
        exit: {
            x: '-100vh',
            opacity: 0,
        },
    }
    return (
        <Backrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className='log-form'
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <h1>Log in</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type='text'
                        placeholder='User Name'
                        value={loginUserName}
                        onChange={(e) => setLoginUserName(e.target.value)}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button onClick={handleClose} type='submit'>Log in!</button>
                </form>
                <h1>Or Sign In!</h1>
            </motion.div>
        </Backrop>

    )
}

export default LogForm
