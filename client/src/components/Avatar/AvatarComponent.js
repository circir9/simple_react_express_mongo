import React, { useState } from 'react';
import axios from 'axios';
import './AvatarComponent.css';

const AvatarComponent = ({ patchAvatarUrl, getAvatarUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const avatar_max_size = 1024*1024*10;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    

      if (file && (file.size<=avatar_max_size)) {
        setSelectedFile(file);
        setPreviewImg(URL.createObjectURL(file));
        setPercent(0);
        setLoading(false);
      } else {
        if(file.size>avatar_max_size){
          alert('頭像大小必須小於10MB');
        }
        setSelectedFile(null);
        setPreviewImg(null);
      }
  };

  const handleUpload = () => {
    setPercent(0);
    if (!selectedFile) {
      alert('Please select a file before uploading.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      axios.patch(patchAvatarUrl, formData, {
        onUploadProgress: function (e) {
          const percentComplete = (e.loaded / e.total) * 100;
          setPercent(percentComplete);
        },
      })
      .then(response => {
        console.log(response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setLoading(false);
    }
    // 模擬上傳5秒
    // const intervalId = setInterval(() => {
    //   setPercent(prevPercent => {
    //     const newPercent = prevPercent + 1;
    //     if (newPercent >= 100) {
    //       setLoading(false);
    //       clearInterval(intervalId);
    //     }
    //     return newPercent;
    //   });
    // }, 50);
  };

  return (
    <div className='avatar-container'>
      <div className="avatar-preview-container" onClick={() => document.getElementById('fileInput').click()}>
        <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
        <div className="avatar-mask" style={{ height: `${((percent===100)?(0):(percent))}%` }}>
        </div>
        {previewImg ? <img className="avatar-preview-img" src={previewImg} alt="預覽頭貼" />:<div>點擊更換</div>}
      </div>
      <div className={`avatar-input ${loading ? 'loading' : ''}`}>
        <button onClick={handleUpload}>上傳頭貼</button>
        <div className="avatar-progress-container">
          <div className="avatar-progress">{percent}%</div>
        </div>
      </div>
    </div>
  );
};

export default AvatarComponent;