import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessageBoard from "../components/MessageBoard/MessageBoard";
import NoEditBoard from "../components/MessageBoard/NoEditBoard";
import AvatarComponent from "../components/Avatar/AvatarComponent";
import ShowAvatar from "../components/Avatar/ShowAvatar";
import { useParams } from "react-router-dom";
import "./ProfilePage.css"
import { Link } from 'react-router-dom';


const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const { user_id } = useParams();
  const [message, setMessage] = useState("...");
  const [isProfileOwer, setIsProfileOwer] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_backend_URL}/profile/message`, { params: { id:user_id } })
    .then(response => {
      setMessage(response.data.user.message)
    })
    .catch (error => {
      console.error('Error checking message:', error);
    });

    const checkLoginStatus = () => {
        axios.get(`${process.env.REACT_APP_backend_URL}/authentication/checkLoginStatus`, { headers: { Authorization: localStorage.getItem("session_id") } })
        .then(response => {
          if(response.data.isLoggedIn){
            setUserId(response.data.user.id);
            if (user_id ===  userId) {
              setIsProfileOwer(true);
            }
          }
        })
        .catch (error => {
          console.error('Error checking login status:', error);
        });
    };

    checkLoginStatus();
    
  }, [user_id, userId]);

  const handleMessageClick = (message) => {
    axios.patch(`${process.env.REACT_APP_backend_URL}/profile/message`, { params: { id:userId, message:message } })
    .catch (error => {
      console.error('Error checking message:', error);
    });
  };

  return (
    <div>
        <div className='home_link'>
              <Link to={`/home/`}>home</Link>
        </div>
        <h2 className="userID-title">用戶ID: {user_id}</h2>
        <div className='message-container'>
          {(isProfileOwer)? (<h1 className="title">留言 {`(雙擊編輯)`}</h1>):(<h1 className="title">留言</h1>)}
          {(isProfileOwer) ? (<MessageBoard className="is_edit" CallbackFn={handleMessageClick} message={message} />):(<NoEditBoard className="is_not_edit" message={message} />)}
        </div>
        <div className='avatar-container_a'>
        <div className='avatar'>
          {/* <ShowAvatar getAvatarUrl={`http://localhost:5000/profile/avatar/${user_id}`} getAvatar={`http://localhost:5000/profile/getAvatar?url=`}/> */}
          <ShowAvatar getAvatarUrl={`${process.env.REACT_APP_backend_URL}/profile/avatar/${user_id}`}/>
        </div>
        <div className='change-avatar'>
          {(isProfileOwer) ? (<AvatarComponent patchAvatarUrl={`${process.env.REACT_APP_backend_URL}/profile/avatar/${user_id}`} getAvatarUrl={`${process.env.REACT_APP_backend_URL}/profile/avatar/${user_id}`} />):(null)}
        </div>
        </div>
    </div>
  );
};

export default ProfilePage;