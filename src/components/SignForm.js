import React, { useState } from 'react';
import axios from 'axios';

const SignForm = ({ handleClose, toggleForm }) => {

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState('');


    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/signup', {
                userName: newUserName,
                password: newUserPassword,
                passwordConfirm: newUserPasswordConfirm,
                userEmail: newUserEmail,
            });
            console.log(response.data);
            toggleForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSignUp}>
            <div className='input-container'>
                <input
                    name='newUserName'
                    type='text'
                    placeholder='User Name'
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='input-container'>
                <input
                    name='newUserEmail'
                    type='text'
                    placeholder='Email'
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='input-container'>
                <input
                    name='newUserPass'
                    type='password'
                    placeholder='Password'
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='input-container'>
                <input
                    name='newUserPassConfirm'
                    type='password'
                    placeholder='Confirm Password'
                    value={newUserPasswordConfirm}
                    onChange={(e) => setNewUserPasswordConfirm(e.target.value)}
                />
                <span className='input-bar'></span>
            </div>
            <div className='container-btn'>
                <button className='add-task-btn' type='submit'>Sign up!</button>
            </div>
        </form>
    );
};

export default SignForm;
