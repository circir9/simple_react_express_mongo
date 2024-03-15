import React, { Component } from 'react';
import "./MessageBoard.css"

class MessageBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      editText: '',
      isEditing: false
    };
  }

  handleDoubleClick = () => {
    this.setState({
      editText: this.state.message,
      isEditing: true
    });
  };

  handleEditChange = (event) => {
    this.setState({
      editText: event.target.value,
    });
  };

  handleEditSubmit = () => {
    const { editText } = this.state;
    const { CallbackFn } = this.props;

    CallbackFn(editText);
    this.setState({
      message: editText,
      isEditing: false
    });
  };

  render() {
    const { message, editText, isEditing } = this.state;

    return (
      <div style={{margin: 2, width:620}}>
        {isEditing ? (
          <div className='board-and-btn'>
            <div className='input-board-container'>
              <textarea
                className='input-board-editing'
                value={editText}
                onChange={this.handleEditChange}
              />
            </div><br />
            <button onClick={this.handleEditSubmit}>編輯</button>
          </div>
        ) : (
          <div className='board-and-btn'>
            <div className='input-board-container'>
              <div className="input-board" onDoubleClick={this.handleDoubleClick}>
              {message? (<pre>{message}</pre>) : (<pre>    </pre>)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MessageBoard;