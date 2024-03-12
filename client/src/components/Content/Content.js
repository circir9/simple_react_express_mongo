import React from 'react';

const Content = ({ list, setList, url}) => {
    const onRemove = (item) => {
        const id = item.id;
        const newList = list.filter(e => e.id !== id);
        setList(newList);
        fetch(`${url}/${id}`, {
            method: "DELETE",
        })
    };

    return (
    <div>
    {
        list.map((item) => {
            return <ul 
                className="member-list"
                key={item.id}
                style={{ cursor: 'pointer' }}
            >
              {item.id} - {item.name} - {item.identity}
                <span>
                    <button onClick={() => onRemove(item)}>刪除</button>
                </span>
            </ul>;
        })
    }
    </div>
    )
};

export default Content;