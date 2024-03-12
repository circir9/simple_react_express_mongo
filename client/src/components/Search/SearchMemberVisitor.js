function IsMembersExist(members) {
    if(members.length === 0){
        return false;
    }
    else{
        return true;
    }
}

function SearchMemberVisitor(visit) {
    if(isNaN(Number(visit.inputSearchValue)) && (visit.selectedOption === "id")){
        alert("搜尋的id必須為數字");
    }
    else{
        fetch(`${process.env.REACT_APP_backend_URL}/members/${visit.selectedOption}/${visit.inputSearchValue}`, { method: "GET", })
        .then((response) => response.json())
        .then((members) => {
            if(IsMembersExist(members)){
                visit.setMembers(members)
            }
            else{
                visit.setMembers([]);
                alert("條件不存在");
            };
        });
    };
};

export default SearchMemberVisitor;