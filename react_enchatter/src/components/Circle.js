import React from "react";

const Circle = (props) => {
    let color = "437a64";
    if (props.color !== undefined){
        color = props.color;
    }
    let username = "X";
    if (props.username !== undefined && props.username !== null){
        username = props.username[0].toUpperCase();
    }
    let style = {
        backgroundColor: `#`+color,
        lineHeight: props.size+`px`,
        width: props.size,
        height: props.size,
        fontSize: parseInt(props.size/1.5)+`px`};
    return (<div className="circle" style={style}>{username}</div>)
};

export default Circle;
