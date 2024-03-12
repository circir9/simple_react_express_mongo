import React, { useContext, useEffect } from 'react';
import { LoggedInContext, SetLoggedInContext } from '../../context/AuthenticationContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LoginButton = ({ checkLoginStatusUrl, loginPageUrl}) => {
    const setLoggedInContext = useContext(SetLoggedInContext);
    const loggedInContext = useContext(LoggedInContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${checkLoginStatusUrl}`, { headers: { Authorization: localStorage.getItem("session_id") } })
        .then(response => {
            setLoggedInContext.setLoggedInContext(response.data.isLoggedIn);
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });

    }, [checkLoginStatusUrl, setLoggedInContext]);

    const handleLogin = () => {
        navigate(`${loginPageUrl}`);
        // window.location.href = loginPageUrl;
    };

    if (!loggedInContext.loggedInContext) {
        return (
        <div>
            <button className='log_in_bt' onClick={handleLogin}>登入</button>
        </div>
        );
    } 
    else {
        return null;
    }
};

export default LoginButton;