import React from "react";
import MessageBoard from "../components/MessageBoard/MessageBoard";


const MessagePage = () => {
    
    const maxCount = 100;

    const handleClick = (message) => {
        console.log(message);
    };

    const handleMaxCount = (board) => {
      const { editText } = board.state;
      const { CallbackFn } = board.props;
      if(editText.length>100){
        alert(`字數必須少於${maxCount}`);
      }
      else{
        CallbackFn(editText);
        board.setState({
          message: editText,
          isEditing: false
        });
      }

    }

    return (
      <div className="center-content">
        <h1 className="title">留言 {`(雙擊編輯)(少於100字)`}</h1>
          <div className="message-board">
            <MessageBoard CallbackFn={handleClick} LimitStateFn={handleMaxCount} message={"before"} />
          </div>
      </div>
    );
  };

export default MessagePage;