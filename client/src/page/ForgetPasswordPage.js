import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgetPasswordPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        const response = await axios.get(`${process.env.REACT_APP_backend_URL}/authentication/forget/is_exist?username=${username}&email=${email}`);
        const { exists } = response.data;
        if(exists){
            navigate(`/changePW`,{
                state: {username, email}
            });
        }
        else{
            alert("帳戶不存在");
        }
      };
    
    return (
        <div>
            <h1>忘記密碼</h1>
            <p>輸入帳號</p>
            <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            /><br />
            <p>輸入信箱</p>
            <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleClick}>Submit</button><br />
        </div>
    );

};

export default ForgetPasswordPage;