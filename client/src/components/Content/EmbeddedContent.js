import React from "react";
import PeepoSad from '../../images/peeposad.png';
import './EmbeddedContent.css';

const EmbeddedContent = () => {
  return (
    <>
        <div>
            <img src={PeepoSad} className="peepo-sad" alt="PeepoSad" />
        </div>
        <ul>
            {Array.from({ length: 20 }, (_, index) => (
            <li key={index}>List Item {index + 1}</li>
            ))}
        </ul>
    </>
  );
};

export default EmbeddedContent;