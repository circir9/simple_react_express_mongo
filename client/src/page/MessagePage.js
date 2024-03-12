import React from "react";
import MessageBoard from "../components/MessageBoard/MessageBoard";


const MessagePage = () => {
    const handleClick = (message) => {
        console.log(message);
    };

    return (
      <div className="center-content">
        <h1 className="title">留言 {`(雙擊編輯)`}</h1>
          <div className="message-board">
            <MessageBoard CallbackFn={handleClick} message={"before"} />
          </div>
      </div>
    );
  };

export default MessagePage;