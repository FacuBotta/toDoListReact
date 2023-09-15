import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const LogForm = ({ handleClose }) => {
    const { login } = useAuth()
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login({ loginUserName, loginPassword })
        } catch (error) {
            console.error('An error occurred while logging in:', error);
        }
    };


    return (
        <form onSubmit={handleLogin}>
            <div className='input-container'>
                <input
                    type='text'
                    placeholder='User Name'
                    value={loginUserName}
                    onChange={(e) => setLoginUserName(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='input-container'>
                <input
                    type='password'
                    placeholder='Password'
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='container-btn'>
                <button className='add-task-btn' onClick={handleClose} type='submit'>Log in!</button>
            </div>
        </form>
    )
}

export default LogForm
