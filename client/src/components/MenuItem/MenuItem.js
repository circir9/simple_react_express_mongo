import React, {useContext} from 'react';
import { SetOpenContext } from '../../context/ControlContext';

const menuItemStyle = {
    marginBottom: "7px",
    paddingLeft: "26px",
    listStyle: "none"
};


function MenuItem(props){
    const setOpenContext = useContext(SetOpenContext);
    return <ul 
        style={menuItemStyle}
        onClick={()=>{setOpenContext.setOpenContext(false)}}
    >
        {props.text}
        </ul>;
}

export default MenuItem;