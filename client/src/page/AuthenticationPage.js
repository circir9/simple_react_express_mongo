import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { SetLoggedInContext } from '../context/AuthenticationContext';
import { useNavigate, Link } from "react-router-dom";

const AuthenticationPage = () => {
    const [publicKey, setPublicKey] = useState(null);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const setLoggedInContext = useContext(SetLoggedInContext);
    const getPublicKeyUrl = `${process.env.REACT_APP_backend_URL}/getPublicKey`
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        axios.get(getPublicKeyUrl, { signal })
        .then((response) => {
            const publicKeyPEM = response.data;
            setPublicKey(publicKeyPEM);
        })
        .catch((error) => {
            console.error(error);
        });
        return () => controller.abort();
    }, [getPublicKeyUrl]);

    const handleLoginClick = () => {
        if (publicKey) {
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            const encrypted = encrypt.encrypt(password);
      
            axios.post(`${process.env.REACT_APP_backend_URL}/authentication/login`, { username: username, encryptedPassword: encrypted}, { withCredentials: true, credentials: "include" })
            .then((response) => {
                const { IsLoginSuccess, cookie } = response.data;

                if (!IsLoginSuccess && username && password) {
                    console.log('登入失敗');
                    alert("帳號或密碼錯誤");
                }
                else if(!username){
                    alert("username為空值");
                }
                else if(!password){
                    alert("password為空值");
                }
                else {
                    localStorage.setItem("session_id", cookie);
                    console.log('登入成功');
                    setLoggedInContext.setLoggedInContext(true);
                    navigate(`/home/`);
                    // window.location.href = 'http://localhost:3000/#/home';
                }
            })
            .catch((error) => {
              console.error(error);
            });

        }
      };
    
    return (
        <div>
            <h1>登入</h1>
            <p style={{ width:200 }}>
                <label style={{ margin: 2 }}>
                    user name
                    <span style={{ margin: 4, color: "red" }}>*</span>
                </label>
            <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            </p>
            <p style={{ width:200 }}>
              <label style={{ margin: 2 }}>
                password
                <span style={{ margin: 4, color: "red" }}>*</span>
              </label>
            <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            </p>
            <button onClick={handleLoginClick}>Submit</button><br />
            <Link to={`/signup/`} style={{margin: 5}} >註冊</Link>
            <Link to={`/forgetPW/`} style={{margin: 5}} >忘記密碼</Link>
        </div>
    );

};

export default AuthenticationPage;