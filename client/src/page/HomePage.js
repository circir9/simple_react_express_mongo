import React from 'react';
import HomeImage from '../images/101687510_p0.jpg';

const HomePage = () =>{

    return (
        <div className="img-container">
            <img src={HomeImage} className="last-origin-img" alt="lastOrigin" />
        </div>
    );
}

export default HomePage;