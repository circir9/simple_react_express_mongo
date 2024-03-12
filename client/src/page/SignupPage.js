import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import Select from "../components/Select/Select";
import { SetLoggedInContext } from '../context/AuthenticationContext';
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [publicKey, setPublicKey] = useState(null);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const genderOption = ["---請選擇---", "男", "女", "戰鬥直升機"];
    const [gender, setGender] = useState(genderOption[0]);
    const setLoggedInContext = useContext(SetLoggedInContext);
    const navigate = useNavigate();

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

    const handleSignupClick = () => {
        if (publicKey && (gender !== genderOption[0]) && username && password && email) {
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            const encrypted = encrypt.encrypt(password);
            axios.post(`${process.env.REACT_APP_backend_URL}/authentication/signup`, { username: username, encryptedPassword: encrypted, email: email, gender: gender }, { withCredentials: true, credentials: "include"  })
            .then((response) => {
              if (!response.data) {
                console.log('註冊失敗');
              }
              else {
                console.log('註冊成功');
                // 註冊成功並登入
                axios.post(`${process.env.REACT_APP_backend_URL}/authentication/login`, { username: username, encryptedPassword: encrypted}, { withCredentials: true, credentials: "include" })
                .then((response) => {
                  const { IsLoginSuccess, cookie } = response.data;
                  if (!IsLoginSuccess) {
                    console.log('登入失敗');
                  }
                  else {
                    localStorage.setItem("session_id", cookie);
                    console.log('登入成功');
                    setLoggedInContext.setLoggedInContext(true);
                    navigate(`/home/`);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
        else if (gender === genderOption[0]){
          alert("gender未選擇");
        }
        else if(!username){
          alert("Username為空值");
        }
        else if(!password){
          alert("password為空值");
        }
        else if(!email){
          alert("email為空值");
        }
      };
    
    return (
        <div>
            <h1>註冊</h1>
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
            <p style={{ width:200 }}>
              <label style={{ margin: 2 }}>
                email
                <span style={{ margin: 4, color: "red" }}>*</span>
              </label>
              <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </p>
            <p style={{ width:100 }}>
              <label style={{ margin: 2 }}>
                gender
                <span style={{ margin: 4, color: "red" }}>*</span>
              </label>
              <Select 
              options={genderOption} 
              setSelectInputValue={setGender}
              />
            </p>
            <button onClick={handleSignupClick}>Submit</button>
        </div>
    );

};

export default SignupPage;