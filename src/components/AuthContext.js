
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    //verification auth user status
    useEffect(() => {
        console.log('user in the context before axios auth:', user)
        axios.get('http://localhost:3001/api/isAuth', { withCredentials: true })
            .then((response) => {
                if (response.data.auth) {
                    setIsAuth(true);
                    setUser(response.data);
                    localStorage.setItem('isAuth', true);
                    console.log('user in the context after axios auth:', user)
                    console.log('user response.data after axios auth:', response.data)
                } else {
                    setIsAuth(false);
                    setUser(null);
                    localStorage.setItem('isAuth', false);
                    console.log('else in auth')
                }

            })
            .catch((error) => {
                console.error('error in auth:', error.response.data.error);
            });
    }, [])

    const login = async (credentials) => {
        console.log('user in the context before axios login:', user)

        try {
            const response = await axios.post('http://localhost:3001/api/login', {
                userName: credentials.loginUserName,
                password: credentials.loginPassword,
            }, { withCredentials: true });
            if (response.data.auth) {
                setUser(response.data);
                setIsAuth(true)
                navigate(`/Home/${response.data.name}`);
                console.log('user in the context after axios login:', user)
                console.log('response.data in the context after axios login:', response.data)

            }
        } catch (error) {
            console.log(error);
        }

    };

    const logout = async () => {
        axios.post('http://localhost:3001/api/logOut', null, { withCredentials: true })
            .then((response) => {
                if (response.data.logout) {
                    localStorage.setItem('isAuth', false);
                    setIsAuth(false);
                    setUser(null);
                    console.log('logout maked')
                } else {
                    console.log('already log out');
                }
            })
            .catch((error) => {
                console.log(error)
            })
    };

    const delUser = async () => {
        axios.get('http://localhost:3001/api/deleteUser', {
            withCredentials: true
        })
            .then((response) => {
                window.alert(response.data.message);
                localStorage.setItem('isAuth', false);
                setIsAuth(false);
                setUser(null);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const value = {
        user,
        isAuth,
        logout,
        login,
        delUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
