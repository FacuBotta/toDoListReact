import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogForm = ({ handleAuth, handleClose }) => {

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
            handleAuth(true);
            navigate('/User-home');
            
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                window.alert(error.response.data.message)
            } else {
                console.error('An error occurred while logging in');
            }
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
