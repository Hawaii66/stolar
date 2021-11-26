import React, { useEffect } from 'react'
import { Pos } from '../../Interfaces/Classroom'
import { EditModes } from './Drawer'

interface Props{
    name:string,
    pos:Pos,
    size:Pos,
    index:number,
    current:number,
    setCurrent:(i:number)=>void,
    changeLecturePos:(index:number,pos:Pos)=>void,
    mousePos:Pos,
    grid:Pos,
    offset:Pos,
    scale:number,
    editMode:EditModes
}

const snapToGrid = (n:number,grid:number):number => {
    return grid * Math.round(n/grid)
}

function Lecturne({name,pos,size,current,index,editMode,mousePos,offset,grid,scale,setCurrent,changeLecturePos}:Props) {
    useEffect(() => {
        if(current === index){
            if(editMode === EditModes.Move){
                var x = snapToGrid((mousePos.x - size.x / 2 - offset.x)/scale,grid.x);
                var y = snapToGrid((mousePos.y - size.y / 2 - offset.y)/scale,grid.y);

                if(x !== pos.x || y !== pos.y){
                    changeLecturePos(index, {x:x,y:y});
                }
            }
        }
    }, [mousePos, changeLecturePos, current, grid, index, offset, size, pos, scale, editMode])

    const lectureClicked = () => {
        if(editMode === EditModes.Move || editMode === EditModes.Properties){
            if(current === index){
                setCurrent(-1);
            }else{
                setCurrent(index);
            }
        }
    }

    return (
        <div onClick={()=>lectureClicked()} className={`Lecture`} style={{left:pos.x+"px",top:pos.y+"px",width:size.x+"px",height:size.y+"px"}}>
            <h2>{name}</h2>
        </div>
    )
}

export default Lecturne
