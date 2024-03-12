import React, { useContext, useEffect } from 'react';
import { LoggedInContext, SetLoggedInContext } from '../../context/AuthenticationContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ checkLoginStatusUrl, signoutUrl}) => {
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

    const handleLogout = () => {
        axios.get(`${signoutUrl}`, { headers: { Authorization: localStorage.getItem("session_id") } })
        .then(response => {
            localStorage.removeItem("session_id");
            console.log(response.data[0])
            setLoggedInContext.setLoggedInContext(false);
            navigate(`/home/`);
            // window.location.href = 'http://localhost:3000/#/home';
        })
        .catch(error => {
            console.error('Logout failed:', error);
        });
    };

    if (loggedInContext.loggedInContext) {
        return (
        <div>
            <button className='log_out_bt' onClick={handleLogout}>登出</button>
        </div>
        );
    } 
    else {
        return null;
    }
};

export default LogoutButton;