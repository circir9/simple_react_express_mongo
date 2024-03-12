import React, { useContext, useEffect, useState } from 'react';
import { LoggedInContext, SetLoggedInContext } from '../../context/AuthenticationContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfileLink = ({ checkLoginStatusUrl, profileUrl}) => {
    const setLoggedInContext = useContext(SetLoggedInContext);
    const loggedInContext = useContext(LoggedInContext);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        axios.get(`${checkLoginStatusUrl}`, { headers: { Authorization: localStorage.getItem("session_id") } })
        .then(response => {
            setLoggedInContext.setLoggedInContext(response.data.isLoggedIn);
            if(loggedInContext.loggedInContext){
                setUserId(response.data.user.id);
            };
        })
        .catch(error => {
            console.error('Error checking login status:', error);
        });

    }, [checkLoginStatusUrl, setLoggedInContext]);

    if (loggedInContext.loggedInContext) {
        return (
        <div>
            <p>
                <Link to={`${profileUrl}/${userId}`}>進入個人頁面</Link>
            </p>
        </div>
        );
    } 
    else {
        return null;
    }
};

export default ProfileLink;