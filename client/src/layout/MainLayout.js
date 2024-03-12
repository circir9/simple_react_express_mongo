import React from 'react';
import {Link} from "react-router-dom";
import "./MainLayout.css"
import LogoutButton from "../components/Authentication/Signout"
import SignupButton from "../components/Authentication/Signup"
import LoginButton from "../components/Authentication/Login"
import ProfileLink from "../components/Authentication/UserProfile"

const MainLayout = (props) => {
    return(
        <>
            <nav className='top_authentication'>
                <Link to="/home" className="link">home</Link>
                <LoginButton checkLoginStatusUrl={`${process.env.REACT_APP_backend_URL}/authentication/checkLoginStatus`} loginPageUrl='/login'/>
                <SignupButton checkLoginStatusUrl={`${process.env.REACT_APP_backend_URL}/authentication/checkLoginStatus`} signupPageUrl='/signup'/>
                <ProfileLink checkLoginStatusUrl={`${process.env.REACT_APP_backend_URL}/authentication/checkLoginStatus`} profileUrl='/user_profile'/>
                <LogoutButton checkLoginStatusUrl={`${process.env.REACT_APP_backend_URL}/authentication/checkLoginStatus`} signoutUrl={`${process.env.REACT_APP_backend_URL}/authentication/signout`}/>
            </nav>
            <br />
            <nav className='top_layout'>
                <Link to="/" className="link">點我連到第一頁</Link>
                <Link to="/frieren" className="link">點我連到第二頁</Link>
                <Link to="/listform" className="link">點我連到第三頁</Link>
                <Link to="/menu" className="link">點我連到第四頁</Link>
                <Link to="/projectfile" className="link">點我連到第五頁</Link>
                <Link to="/image/page/1" className="link">點我連到第六頁</Link>
                <Link to="/message_board" className="link">點我連到第七頁</Link>
            </nav>
            { props.children }
        </>
    )
};

export default MainLayout;