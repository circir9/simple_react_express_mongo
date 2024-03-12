import { useParams, useNavigate } from "react-router-dom";
import PageComponent from "../components/Pagination/PageComponent"
import React, { useState, useEffect } from "react";
import Axios from "axios";
import './ImageNumberPage.css';

const ImageNumberPage = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const [numOfImg, setNumOfImg] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [imgsInfo, setImgsInfo] = useState([]);
  const [pageImagecount, setPageImagecount] = useState(10);
  // const [imageData, setImageData] = useState([]);

  // 
  // useEffect(() => {
  //     Axios.get(`http://localhost:5000/projectfile/getDocumentCount`).then((response) => {
  //       setNumOfImg(response.data.numOfData);
  //       setTotalPage(Math.floor(numOfImg / 11) + 1);
  //     });
  // }, [numOfImg]);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_backend_URL}/projectfile/getPageImages?limit=${pageImagecount}&order=${"desc"}&page=${pageNumber}`).then((response) => {
      setImgsInfo(response.data.files);
      setNumOfImg(response.data.count);
      setTotalPage(Math.floor(numOfImg / pageImagecount) + 1);
    });
  }, [pageNumber, numOfImg, pageImagecount]);

  // useEffect(() => {
  //   Axios.get(`http://localhost:5000/projectfile/getPageImages?limit=${pageImagecount}&order=${"desc"}&page=${pageNumber}`)
  //     .then((response) => {
  //       const imageArray = response.data.files.map(async (datas) => {
  //         try {
  //           const imageResponse = await Axios.get(`http://localhost:5000/projectfile/getImage?url=${datas.url}`, { responseType: 'arraybuffer' });
  //           const base64ImageString = Buffer.from(imageResponse.data, 'binary').toString('base64');
  //           return { id: datas._id, base64ImageString };
  //         } catch (error) {
  //           console.error("Error loading image:", error);
  //           return { id: datas._id, base64ImageString: null };
  //         }
  //       });
  
  //       Promise.all(imageArray).then((result) => {
  //         setImageData(result);
  //       });
  
  //       setImgsInfo(response.data.files);
  //       setNumOfImg(response.data.count);
  //       setTotalPage(Math.floor(numOfImg / pageImagecount) + 1);
  //     });
  // }, [pageNumber, numOfImg, pageImagecount]);

  const handleClick = (currentPage) => {
    navigate(`/image/page/${currentPage}`);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // const getFileName = (path) => {
  //   const normalizedPath = path.replace(/\\/g, '/');
  //   const pathSegments = normalizedPath.split('/');
  //   const fileName = pathSegments[pathSegments.length - 1];
    
  //   return fileName;
  // };

  return (
    <div>
    <div className="pagination">
      <PageComponent key={`${pageNumber}_${totalPage}`} pageCallbackFn={handleClick} totalPage={totalPage} currentPage={Number(pageNumber)} siblingCount={1}></PageComponent>
    </div>
    <div>
      <h1 className="image-area-title">預覽圖</h1>
      <div className="image-gallery">
        {/* {imgsInfo.map(datas => {
          try {
            // const reqSvgs = require.context("../../../uploads", true);
            // // const parts = datas.url.split("\\");
            // // const fileName = parts[parts.length - 1];
            // const fileName = getFileName(datas.url);
            // const image = reqSvgs(`./${fileName}`);
            Axios.get(`http://localhost:5000/projectfile/getImage?url=${datas.url}`, { responseType: 'arraybuffer' })
            .then((response) => {
              const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
            })
            
            return (
              <div key={datas._id} className="image-item">
                <img ng-src={`data:image/jpeg;base64,${base64ImageString}`} />
              </div>
            );
          } catch (error) {
            console.error("Error loading image:", error);
            return (
              <div key={datas._id} className="image-item">
                <span>Image not found</span>
              </div>
            );
          }
        })} */}

      {/* {imageData.map((data) => (
        <div key={data.id} className="image-item">
          {data.base64ImageString ? (
            <img src={`data:image/jpeg;base64,${data.base64ImageString}`} alt={`Image ${data.id}`} />
          ) : (
            <span>Image not found</span>
          )}
        </div>
      ))} */}
      {imgsInfo.map((data) => (
        <div key={data.id} className="image-item">
          {data.url ? (
            <img src={`${data.url}`} alt={`Image ${data.id}`} />
          ) : (
            <span>Image not found</span>
          )}
        </div>
      ))}

      </div>
    </div>
    <div className="scroll-top-button">
      <button onClick={scrollToTop}>
        Top
      </button>
    </div>
  </div>
  );


};

export default ImageNumberPage;









