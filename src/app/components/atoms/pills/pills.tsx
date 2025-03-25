import React from 'react';
export interface PillsProps{
    text: string;
    color: string;
    bgColor: string;

}

const Pills: React.FC<PillsProps> = (
    {text,
    color,
    bgColor}) => {
    return(
        <>
        <p className={`px-1 py-1 rounded-full ${color} ${bgColor} inline-block`}>{text}</p>
        </>
    )
}

export default Pills;