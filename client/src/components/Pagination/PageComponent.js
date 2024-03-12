import React, { Component } from 'react'
import './PageComponent.css';
import PropTypes from 'prop-types';

class PageComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage : props.currentPage,
            totalPage : props.totalPage,
            siblingCount : props.siblingCount
        }
    }

    pageClick(currentPage) {
        const handleClick = this.props.pageCallbackFn;
        this.setState({
            currentPage
        })
        //回傳父組件點擊頁碼
        handleClick(currentPage)
    }
    //上一頁
    prePageHandeler() {
        let { currentPage } = this.state
        this.pageClick(--currentPage)
    }
    //下一頁
    nextPageHandeler() {
        let { currentPage } = this.state
        this.pageClick(++currentPage)
    }

    render() {
        const { currentPage, totalPage, siblingCount } = this.state;
        let pages = []
        //上一頁
        if(currentPage === 1){
            pages.push(<li key={0} className={"noPreviousPage"}>上一頁</li>)
        }
        else{
            pages.push(<li key={0} onClick={this.prePageHandeler.bind(this)}
                className={"previousPage"}>上一頁</li>)
        }

         //小於10頁全部顯示
        if(totalPage < 10){
            for (let i = 1; i <= totalPage; i++) {
                pages.push(<li key={i} onClick={this.pageClick.bind(this, i)}
                    className={currentPage === i ? "activePage" : "noActivePage"}>{i}</li>)
            }
        } 
        else{
            //第一頁
            pages.push(<li className={currentPage === 1 ? "activePage" : "noActivePage"} key={1}
                onClick={this.pageClick.bind(this, 1)}>1</li>)

            //與第一頁差距太遠時加入審略符號
            if ((currentPage-siblingCount-1) > 2) {
                pages.push(<li className="ellipsis" key={-1}>···</li>)
            }
            //與第一頁差距太遠但中間只隔第2頁時加入第二頁頁碼
            if ((currentPage-siblingCount-1) === 2) {
                pages.push(<li className={"noActivePage"} key={2}
                    onClick={this.pageClick.bind(this, 2)}>2</li>)
            }
            //其餘中間分群頁碼
            for (let i = currentPage-siblingCount; i < currentPage+siblingCount+1; i++) {
                if (i <= totalPage - 1 && i > 1) {
                    pages.push(<li className={currentPage === i ? "activePage" : "noActivePage"} key={i}
                        onClick={this.pageClick.bind(this, i)}>{i}</li>)
                }
            }
            //與第最後一頁差距太遠但中間只隔倒數第二頁時加入倒數第二頁頁碼
            if ((currentPage+siblingCount+1) === (totalPage-1)) {
                pages.push(<li className={"noActivePage"} key={(totalPage-1)}
                    onClick={this.pageClick.bind(this, (totalPage-1))}>{(totalPage-1)}</li>)
            }
            //與最後一頁差距太遠時加入審略符號
            if ((currentPage+siblingCount+1) < (totalPage-1)) {
                pages.push(<li className="ellipsis" key={-2}>···</li>)
            }
            //最後一頁
            pages.push(<li className={currentPage === totalPage ? "activePage" : "noActivePage"} key={totalPage}
                onClick={this.pageClick.bind(this, totalPage)}>{totalPage}</li>)
        }
        //下一頁
        if(currentPage === totalPage){
            pages.push(<li key={totalPage + 1} className={"noNextPage"}>下一頁</li>)
        }
        else{
            pages.push(<li onClick={this.nextPageHandeler.bind(this)} key={totalPage + 1}
                className={"nextPage"}>下一頁</li>)
        }

        return (
            <ul className="g-page">
               { pages }
            </ul>
        )
    }
}

PageComponent.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPage: PropTypes.number.isRequired,
    siblingCount: function(props, propName, componentName) {
        const value = props[propName];
        if (value < 0 || !Number.isInteger(value)) {
            return new Error(`Invalid ${propName} supplied to ${componentName}. Must be a non-negative integer.`);
        }
    }
};

export default PageComponent;