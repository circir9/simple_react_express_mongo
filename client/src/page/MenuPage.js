import React, {useState, useRef, useCallback, useMemo} from 'react';

import MenuItem from '../components/MenuItem/MenuItem';
import Menu from '../components/Menu/Menu';
import { OpenContext, SetOpenContext } from '../context/ControlContext';

let menuItemWording=[
    "Like的發問",
    "Like的回答",
    "Like的文章",
    "Like的留言"
];

const MenuPage = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [menuItemData, setMenuItemData] = useState(menuItemWording);

    /* 定義counter */
    const renderCounter = useRef(0);
    renderCounter.current++;

    /* 定義列印函式 */
    // const handleClick = useCallback(() => {
    //     console.log("counter is " + renderCounter.current);
    // }, [renderCounter]);

    let menuItemArr = useMemo(()=> {
        return menuItemData.map((wording, index) => <MenuItem key={index} text={wording}/>)
    }, [menuItemData]);

    return (
        <OpenContext.Provider value={{ openContext: isOpen }} >
            <SetOpenContext.Provider value={{ setOpenContext: setIsOpen }}>
                <Menu title={"Andy Chang的like"}>
                    {menuItemArr}
                </Menu>
                <button 
                    onClick={()=>{
                        let menuDataCopy = ["測試資料"].concat(menuItemData);
                        setMenuItemData(menuDataCopy); 
                    }}>
                        更改第一個menuItem
                </button>
            </SetOpenContext.Provider>
        </OpenContext.Provider>
    );
}

export default MenuPage;