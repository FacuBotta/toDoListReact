import React, { useState } from 'react';
import axios from 'axios';
import LogForm from '../components/LogForm';

const LogPage = () => {
    
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
            // navigate('/User-home', { state: response.data[0].id_user });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='container-all'>
            <LogForm/>
            <form className='log-form' onSubmit={handleSignUp}>
                <input
                    name='newUserName'
                    type='text'
                    placeholder='User Name'
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                />
                <input
                    name='newUserEmail'
                    type='text'
                    placeholder='Email'
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                />
                <input
                    name='newUserPass'
                    type='password'
                    placeholder='Password'
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                />
                <input
                    name='newUserPassConfirm'
                    type='password'
                    placeholder='Confirm Password'
                    value={newUserPasswordConfirm}
                    onChange={(e) => setNewUserPasswordConfirm(e.target.value)}
                />
                <button type='submit'>Sign up!</button>
            </form>
        </div>
    );
};

export default LogPage;
