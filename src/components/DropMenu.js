import React from 'react'
import { Link } from 'react-router-dom';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const DropMenu = React.forwardRef(({ handleLogOut, handleDeleteUser, handleMenu}, ref ) => {

    return (
        <div ref={ref} className='drop-menu'>
            <ul>
                <li className='item-menu' onClick={(e) => handleMenu(e)}>
                    <FormatListBulletedIcon />
                    <Link to="/user-home">My tasks</Link>
                </li>
                <li className='item-menu' onClick={(e) => handleLogOut(e)}>
                    <LogoutIcon />
                    <Link >Log Out</Link>
                </li>
                <li className='item-menu' onClick={(e) => handleDeleteUser(e)}>
                    <PersonRemoveIcon />
                    <Link >Unsubscribe</Link>
                </li>
            </ul>
        </div>
    )
});

export default DropMenu
