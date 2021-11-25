import React, { useEffect } from 'react'
import { Pos } from '../../Interfaces/Classroom'
import { EditModes } from './Drawer'

interface Props{
    name:string,
    pos:Pos,
    size:Pos,
    force:boolean,
    index:number,
    current:number,
    setCurrent:(i:number)=>void,
    changeChairPos:(index:number,pos:Pos)=>void,
    changeChairForce:(index:number,force:boolean)=>void
    mousePos:Pos,
    grid:Pos,
    offset:Pos,
    scale:number,
    editMode:EditModes
}

const snapToGrid = (n:number,grid:number):number => {
    return grid * Math.round(n/grid)
}

function Stol({name,pos,size,force,index,current,scale,setCurrent,changeChairPos,changeChairForce,mousePos,grid,offset,editMode}:Props) {
    useEffect(() => {
        if(current === index){
            if(editMode === EditModes.Move){
                var x = snapToGrid((mousePos.x - size.x / 2 - offset.x)/scale,grid.x);
                var y = snapToGrid((mousePos.y - size.y / 2 - offset.y)/scale,grid.y);

                if(x !== pos.x || y !== pos.y){
                    changeChairPos(index, {x:x,y:y});
                }
            }
        }
    }, [mousePos, changeChairPos, current, grid, index, offset, size, pos, scale, editMode])

    const stolClicked = () => {
        if(editMode === EditModes.Move || editMode === EditModes.Properties){
            if(current === index){
                setCurrent(-1);
            }else{
                setCurrent(index);
            }
        }
    }

    return (
        <div onClick={()=>stolClicked()} className={`Stol ${force ? "Force" : ""}`} style={{left:pos.x+"px",top:pos.y+"px",width:size.x+"px",height:size.y+"px"}}>
            <h2>{name}</h2>
        </div>
    )
}

export default Stol
