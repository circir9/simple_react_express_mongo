import React, { Component } from 'react';
import "./NoEditBoard.css"

class NoEditBoard extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     message: props.message,
  //   };
  // }

  render() {
    const { message } = this.props;

    return (
      <div>
          <div className='board-no-btn'>
            <div className='no-input-board-container'>
              <div className="no-input-board">
                <pre>{message}</pre>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default NoEditBoard;