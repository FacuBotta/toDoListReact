import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Backrop from './Backrop';
import LogForm from './LogForm';
import SignForm from './SignForm';


const UserForm = ({ handleClose, isUserLoged }) => {
    const [isLogForm, setIsLogForm] = useState(true)

    const toggleForm = () => setIsLogForm(!isLogForm);
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
                <h1>{isLogForm ? 'Welcome Back!' : 'Sign Up!'}</h1>
                {isLogForm ?
                    <LogForm
                        className='log-form'
                        handleClose={handleClose}
                        isUserLoged={isUserLoged}
                    /> :
                    <SignForm
                        className='log-form'
                        handleClose={handleClose}
                        toggleForm={toggleForm}
                    />}
                <h6 className='btn-toggle-log-form' onClick={toggleForm}>{isLogForm ? 'Or Sign Up!' : 'Log in'}</h6>
            </motion.div>
        </Backrop>

    )
}

export default UserForm
