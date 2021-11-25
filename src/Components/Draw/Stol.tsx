import React, { useEffect } from 'react'
import { ClassRoom, Pos } from '../../Interfaces/Classroom'

interface Props{
    name:string,
    pos:Pos,
    size:Pos,
    force:boolean,
    index:number,
    current:number,
    setCurrent:React.Dispatch<React.SetStateAction<number>>,
    changeChairPos:(index:number,pos:Pos)=>void,
    mousePos:Pos,
    classRoom:ClassRoom,
    grid:Pos,
    offset:Pos,
    scale:number
}

const snapToGrid = (n:number,grid:number):number => {
    return grid * Math.round(n/grid)
}

function Stol({name,pos,size,force,index,current,scale,setCurrent,changeChairPos,mousePos,classRoom,grid,offset}:Props) {
    useEffect(() => {
        if(current === index){
            var x = snapToGrid((mousePos.x - size.x / 2 - offset.x)/scale,grid.x);
            var y = snapToGrid((mousePos.y - size.y / 2 - offset.y)/scale,grid.y);

            //x /= scale;
            //y /= scale;

            if(x !== pos.x || y !== pos.y){
                changeChairPos(index, {x:x,y:y});
            }
        }
    }, [mousePos, changeChairPos, current, grid, index, offset, size])

    const stolClicked = () => {
        if(current === index){
            setCurrent(-1);
        }else{
            setCurrent(index);
        }
    }

    return (
        <div onClick={()=>stolClicked()} className={`Stol ${force ? "Force" : ""}`} style={{left:pos.x+"px",top:pos.y+"px",width:size.x+"px",height:size.y+"px"}}>
            <h2>{name}</h2>
        </div>
    )
}

export default Stol
