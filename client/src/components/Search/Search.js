import React, { Component } from "react";
import Select from "../Select/Select";

class Search extends Component {
    constructor(props) {
        super(props);
        this.options = props.options;
        this.setMembers = props.setMembers;
        this.searchVisitor = props.searchVisitor;
        this.inputSearchValue = "";
        this.selectedOption = this.options[0];
    }

    setInputSearchValue = (value) => {
        this.inputSearchValue = value;
    };

    setSelectedOption = (option) => {
        this.selectedOption = option;
    };

    handleChange = (e, setInputSearchValue) => {
        setInputSearchValue(e.target.value);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.inputSearchValue) {
            alert("請輸入搜尋");
        }
        else if (this.selectedOption === this.options[0]) {
            alert("請選擇搜尋條件");
        }
        else {
            this.searchVisitor(this);
        }
    };

    render() {
        return (
            <div>
                <input className="input-search" placeholder="Type to search" onChange={(e) => this.handleChange(e, this.setInputSearchValue)} />
                <Select options={this.options} setSelectInputValue={this.setSelectedOption}/>
                <button className="submit-search" onClick={(e) => this.handleSubmit(e)}>送出</button>
            </div>
        );
    };
}

export default Search;