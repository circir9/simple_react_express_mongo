import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShowAvatar.css';
// import { Buffer } from 'buffer';

// const getFileName = (path) => {
//   const normalizedPath = path.replace(/\\/g, '/');
//   const pathSegments = normalizedPath.split('/');
//   const fileName = pathSegments[pathSegments.length - 1];
  
//   return fileName;
// }

// const localImgToSvg = (imgPath) => {
//     const reqSvgs = require.context("../../../../porfile_uploads");
//     // const parts = imgPath.split("\\");
//     // const fileName = parts[parts.length - 1];
//     const fileName = getFileName(imgPath);
//     const imgUrl = `./${fileName}`;
//     const image = reqSvgs(imgUrl);
//     return image;
//   };

const ShowAvatar = ({ getAvatarUrl }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    axios.get(getAvatarUrl)
    .then((response) => {
        if(response.data.avatarUrl !== ""){
          setAvatarUrl(response.data.avatarUrl);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}, [getAvatarUrl]);

  return (
    <div className="avatar-img-container">
        {
          avatarUrl && <img className="avatar-img" src={`${avatarUrl}`} alt="頭貼" />
        }
    </div>
  );
};

// const ShowAvatar = ({ getAvatarUrl, getAvatar }) => {
//   const [avatarImg, setAvatarImg] = useState(null);

//   useEffect(() => {
//     axios.get(getAvatarUrl)
//     .then((response) => {
//         if(response.data.avatarUrl !== ""){
//           axios.get(`${getAvatar}${response.data.avatarUrl}`, { responseType: 'arraybuffer' })
//           .then((response) =>  setAvatarImg(Buffer.from(response.data, 'binary').toString('base64')))
//         }
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }, [getAvatarUrl]);

//   return (
//     <div className="avatar-img-container">
//         {
//           avatarImg && <img className="avatar-img" src={`data:image/jpeg;base64,${avatarImg}`} alt="頭貼" />
//         }
//     </div>
//   );
// };

export default ShowAvatar;