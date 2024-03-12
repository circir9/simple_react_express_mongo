import React, { useState, useEffect } from "react";
import Content from "../components/Content/Content";
import Select from "../components/Select/Select";
import Search from "../components/Search/Search";
import SearchMemberVisitor from '../components/Search/SearchMemberVisitor';

const MemberPage = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const identityOptions = ["---請選擇---", "老師", "學生"];
  const [identity, setIdentity] = useState(identityOptions[0]);
  const [members, setMembers] = useState([]);
  const schoolMemberUrl = `${process.env.REACT_APP_backend_URL}/members`;
  const SearchOptions = ["---請選擇---", "id", "name", "identity"];

  useEffect(() => {
    // 從 API 取得所有成員
    fetch(schoolMemberUrl ,{
      credentials: "include",
    })
      .then((response) => response.json())
      .then((members) => setMembers(members));
  }, []);

  const isErrorMessage = (response) => {
    if(Object.keys(response)[0] === "errMessage"){
      alert(response.errMessage);
      return true;
    }
    else{
      return false;
    }
  }

  async function handleSubmit(e){
    // 將成員新增到資料庫
    e.preventDefault();
    let m;
    if(id !== ""){
      const r = await fetch(`${schoolMemberUrl}/${id}`);
      m = await r.json();
    }

    if (!isNaN(Number(id)) && id && name && (identity !== identityOptions[0]) && !m.id){
      fetch(schoolMemberUrl, {
        method: "POST",
        body: JSON.stringify({ id, name, identity }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) =>  response.json())
        .then((member) => {if(isErrorMessage(member)){
          return;
        }
        else{
          return setMembers([...members, member]);
        }
      });

    }
    else{
      // 顯示錯誤訊息
      if (!id) {
        alert("id為空值");
      } else if (!name) {
        alert("name為空值");
      } else if (identity === identityOptions[0]) {
        alert("identity為空值");
      } else if (m.id) {
        alert("id已經存在");
      } else if (isNaN(Number(id))) {
        alert("id必須為數字");
      }
    };
  };

  const handleShowAll = () => {
    // 顯示所有成員
    setMembers([]);
    fetch(schoolMemberUrl)
      .then((response) => response.json())
      .then((members) => setMembers(members));
  };

  return (
    <div>
      <span>
        請輸入ID:
        <input
          type="text"
          placeholder="ID"
          onChange={(e) => setId(e.target.value)}
        />
      </span>
      <span>
        請輸入姓名:
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
      </span>
      <span>
        請選擇身份:
        <Select options={identityOptions} setSelectInputValue={setIdentity}/>
      </span>
      <button onClick={handleSubmit}>新增</button>
      <button onClick={handleShowAll}>顯示所有</button>
      <Search options={SearchOptions} setMembers={setMembers} searchVisitor={SearchMemberVisitor}/>
      <Content list={members} setList={setMembers} url={schoolMemberUrl}/>
    </div>
  );
};

export default MemberPage;