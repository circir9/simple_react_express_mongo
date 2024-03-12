import React from "react";
import FrierenImage from '../images/example.jpg';
import './SingleImagePage.css';

const SingleImagePage = () => {
  return (
    <div className="img-container">
      <a href={"https://www.youtube.com/watch?v=O4-uUKlC0BE"} target="_blank" rel="noreferrer">
        <img 
          src={FrierenImage} 
          alt="" 
          className="frieren_image"
        />
      </a>
    </div>
  );
};

export default SingleImagePage;