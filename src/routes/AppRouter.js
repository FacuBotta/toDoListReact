import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import UserHome from '../pages/UserHome';
import HomePage from '../pages/HomePage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage/>} />
                <Route path='/user-home' element={<UserHome/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
