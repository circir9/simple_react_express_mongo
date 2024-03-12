import React from "react";
import EmbeddedContent from "../components/Content/EmbeddedContent";
import './ListFormPage.css';


const ListFormPage = () => {
    return (
      <div className="center-content">
        <h1 className="title">原本的網頁</h1>
        <div className="center">
          <div className="center-content-scroll">
            <EmbeddedContent />
          </div>
        </div>
      </div>
    );
  };

export default ListFormPage;