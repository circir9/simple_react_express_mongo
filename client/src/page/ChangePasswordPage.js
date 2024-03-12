import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { useLocation, useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
    const [password, setPassword] = useState('');
    const [repassword, setRePassword] = useState('');
    const [publicKey, setPublicKey] = useState(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { username, email } = state;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_backend_URL}/getPublicKey`)
        .then((response) => {
            const publicKeyPEM = response.data;
            setPublicKey(publicKeyPEM);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [publicKey]);

    const handleClick = () => {
        if(!password){
            alert("password為空值");
        }
        else if(password === repassword){
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            const encrypted = encrypt.encrypt(password);
            axios.patch(`${process.env.REACT_APP_backend_URL}/authentication/change_password`, { username: username, encryptedPassword: encrypted, email: email })
            .then((response) => {
                alert(response.data.message);
                if(response.data.success){
                    navigate(`/login`);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
        else{
            alert("輸入密碼與重新輸入密碼不同");
        };
      };
    
    return (
        <div>
            <h1>修改密碼</h1>
            <p>輸入密碼</p>
            <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            /><br />
            <p>重新輸入密碼</p>
            <input
            type="password"
            placeholder="Enter Password"
            value={repassword}
            onChange={(e) => setRePassword(e.target.value)}
            />
            <button onClick={handleClick}>Submit</button><br />
        </div>
    );
};

export default ChangePasswordPage;