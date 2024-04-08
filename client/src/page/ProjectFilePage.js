import React, { useState, useEffect } from "react";
import Axios from "axios";

const ProjectFilePage = () => {
  const [files, setFiles] = useState([]);
  const userObject = {
    name: "Ted",
    uid: "12345"
  };
  const image_max_size = 1024*1024*10;

  useEffect(() => {
    // 獲取文件列表
    Axios.get(`${process.env.REACT_APP_backend_URL}/projectfile`).then((response) => {
        setFiles(response.data.file);
    });
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    const image_file_size = document.getElementById("project-image-file").files[0].size;
    
    if(image_file_size < image_max_size){
      const formData = new FormData();
      formData.append("file", event.target.file.files[0]);
      formData.append("user", JSON.stringify(userObject));
    
      try {
        const response = await Axios.post(`${process.env.REACT_APP_backend_URL}/projectfile/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setFiles([...files, response.data.file]);
      } catch (error) {
        console.log(error);
      }
    }
    else{
      alert("檔案最大大小為10MB");
    }
  };

  const handleDelete = async (file) => {
    try {
      await Axios.delete(`${process.env.REACT_APP_backend_URL}/projectfile/delete?id=${file.name}&id=${file.id}&upload_time=${file.upload_time}`);
      const updatedFiles = files.filter((file_n) => file_n.id !== file.id);
      setFiles(updatedFiles);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>圖片上傳下載</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" accept="image/png, image/jpeg" id="project-image-file"/>
        <input type="submit" value="上傳" />
      </form>
      <div>
        {
            files.map((file, index) => (
              <div key={file.id} className="project-files-list">
                <a
                style={{ cursor: 'pointer' }}
                href={`${process.env.REACT_APP_backend_URL}/projectfile/download?name=${file.name}&id=${file.id}&upload_time=${file.upload_time}`}
                >
                {`${file.name}     ---    ${file.upload_time}`}
                </a>
                <button onClick={() => handleDelete(file)}>刪除</button>
                <br />
              </div>
  ))}
      </div>
      <div>上傳圖片於下一頁顯示</div>
    </div>
  );
};

export default ProjectFilePage;