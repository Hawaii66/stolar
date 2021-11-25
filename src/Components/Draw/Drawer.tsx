import React, { useEffect, useRef, useState } from 'react'
import { ClassRoom, Names, Pos } from '../../Interfaces/Classroom'
import { GetClassRoom, SetClassRoomChairs } from '../../ServerRoutes';
import Stol from './Stol'
import "./Stol.css";

enum Modes {"View","Edit"}
export enum EditModes {"Move","Properties"}

function StringToMode (s:string){
    if(s === "View"){
        return Modes.View;
    }
    if(s === "Edit"){
        return Modes.Edit;
    }
    return Modes.View;
}

function StringToEditMode (s:string){
    if(s === "Move"){
        return EditModes.Move;
    }
    if(s === "Properties"){
        return EditModes.Properties;
    }
    return EditModes.Move;
}

function Drawer() {
    const [current,setCurrent] = useState(-1);
    const [mousePos,setMousePos] = useState<Pos>({x:0,y:0});
    const [grid,setGrid] = useState<Pos>({x:1,y:1});
    const [offset,setOffset] = useState<Pos>({x:0,y:0});
    const [mode,setMode] = useState<Modes>(Modes.View);
    const [editMode,setEditMode] = useState<EditModes>(EditModes.Move);
    const [scale,setScale] = useState(1);
    const [classRoom,setClassRoom] = useState<ClassRoom>({
        chairs:[],
        classRoomID:"",
        name:""
    });
    const [names,setNames] = useState<Names>({
        namesID:"71298213",
        className:"Na21B",
        names:[
            {
                firstName:"Sebastian",
                lastName:"Ahlman"
            },{
                firstName:"David",
                lastName:"Dahlin"
            },{
                firstName:"Elise",
                lastName:"Jonmyren"
            },{
                firstName:"Jamal",
                lastName:"Tabara"
            },{
                firstName:"Elin",
                lastName:"Fornstedt"
            },{
                firstName:"Arivd",
                lastName:"Ingvarsson"
            }
        ]
    });

    const stolParentRef = useRef<HTMLDivElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const wraperRef = useRef<HTMLDivElement>(null);
    const sizeXRef = useRef<HTMLInputElement>(null);
    const sizeYRef = useRef<HTMLInputElement>(null);
    const forceRef = useRef<HTMLInputElement>(null);

    const getClassRoomData = () => {
        fetch(GetClassRoom + "1637864914763:360532:stolar", {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            setClassRoom(data.data);
        }))
    }
    
    const AddChair = () => {
        var chairs = [...classRoom.chairs];
        chairs.push({
            force:false,
            sizeX:80,
            sizeY:40,
            x:0,
            y:0
        });
        setClassRoom({
            chairs:chairs,
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        })
    }

    const SaveLayout = () => {
        const data = {
            chairs: classRoom.chairs
        }

        fetch(SetClassRoomChairs + "1637864914763:360532:stolar", {
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            console.log(data);
            setClassRoom(data.data);
        }));
    }

    const changeChairSizeX = (x:number) => {
        changeChairSize({
            x:x,
            y:classRoom.chairs[current].sizeY
        });
    }

    const changeChairSizeY = (y:number) => {
        changeChairSize({
            x:classRoom.chairs[current].sizeX,
            y:y
        });
    }

    const changeChairSize = (pos:Pos) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[current].sizeX = pos.x;
        tempClassRoom.chairs[current].sizeY = pos.y;
        setClassRoom(tempClassRoom);
    }

    const changeChairPos = (index:number, pos:Pos) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[index].x = pos.x;
        tempClassRoom.chairs[index].y = pos.y;
        setClassRoom(tempClassRoom);
    }

    const changeChairForce = (index:number, force:boolean) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[index].force = force;
        setClassRoom(tempClassRoom);
    }

    const doResize = (ui:any) => {
        if(stolParentRef.current === undefined || stolParentRef.current === null){
            setScale(0);
            return;
        }

        var newScale = Math.min(
            ui.size.width / stolParentRef.current.offsetWidth,
            ui.size.height / stolParentRef.current.offsetHeight
        )
        console.log(newScale);
        setScale(newScale); 
    }

    const updateCurrentSelected = (i:number) => {
        setCurrent(i);
        if(i !== -1){
            if(sizeXRef === null || sizeXRef === undefined || sizeXRef.current === undefined || sizeXRef.current === null){
            }else{
                sizeXRef.current.value = classRoom.chairs[i].sizeX.toString();
            }

            if(sizeYRef === null || sizeYRef === undefined || sizeYRef.current === undefined || sizeYRef.current === null){
            }else{
                sizeYRef.current.value = classRoom.chairs[i].sizeX.toString();
            }

            if(forceRef === null || forceRef === undefined || forceRef.current === undefined || forceRef.current === null){
            }else{
                forceRef.current.checked = classRoom.chairs[i].force;
            }
        }
    }

    useEffect(() => {
        if(stolParentRef === null || stolParentRef === undefined || stolParentRef.current === null){
            return;
        }

        setOffset({
            x:stolParentRef.current.getBoundingClientRect().left,
            y:stolParentRef.current.getBoundingClientRect().top
        });
    }, [stolParentRef]);

    useEffect(() => {
        doResize({ 
            size: {
                width: wraperRef.current?.offsetWidth,
                height: wraperRef.current?.offsetHeight
            }
        });
        getClassRoomData();
        if(stolParentRef === null || stolParentRef === undefined || stolParentRef.current === null){
            return;
        }

        setOffset({
            x:stolParentRef.current.getBoundingClientRect().left,
            y:stolParentRef.current.getBoundingClientRect().top
        });
    }, []);

    useEffect(() => {
        const handleResize = ()=>{
            doResize({ 
                size: {
                    width: wraperRef.current?.offsetWidth,
                    height: wraperRef.current?.offsetHeight
                }
            });
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        }
      }, [])

    if(offset.x !== stolParentRef.current?.getBoundingClientRect().left || offset.y !== stolParentRef.current.getBoundingClientRect().top){
        if(stolParentRef === null || stolParentRef === undefined || stolParentRef.current === null){
            console.log(stolParentRef);
        }else{
            setOffset({
                x:stolParentRef.current.getBoundingClientRect().left,
                y:stolParentRef.current.getBoundingClientRect().top
            });
        }
    }

    return (
        <div className="Background">
            <div >
                <select name="mode" id="mode" onChange={(e)=>setMode(StringToMode(e.currentTarget.value))}>
                    <option value="View">Titta</option>
                    <option value="Edit">Ändra</option>
                </select>
                {mode === Modes.Edit && 
                    <div ref={divRef}>
                        <select name="editMode" id="editMode" onChange={(e)=>setEditMode(StringToEditMode(e.currentTarget.value))}>
                            <option value="Move">Flytta</option>
                            <option value="Properties">Egenskaper</option>
                        </select>
                        <input onChange={(e)=>setGrid({x:parseInt(e.currentTarget.value),y:grid.y})} type="number" name="gridX" id="gridX" />
                        <input onChange={(e)=>setGrid({y:parseInt(e.currentTarget.value),x:grid.x})} type="number" name="gridY" id="gridY" />
                        <button onClick={()=>AddChair()}>Lägg till Stol</button>
                        <button onClick={()=>getClassRoomData()}>Ladda Stolar</button>
                        <button onClick={()=>SaveLayout()}>Spara Stolar</button>
                        {editMode === EditModes.Properties && <div>
                            {current !== -1 ? <div>
                                <h3>{names.names[current].firstName}</h3>
                                <input ref={sizeXRef} onChange={(e)=>changeChairSizeX(parseInt(e.currentTarget.value))} defaultValue={classRoom.chairs[current].sizeX} placeholder="Storlek på namnet X" type="number" name="sizeX" id="sizeX" />
                                <input ref={sizeYRef} onChange={(e)=>changeChairSizeY(parseInt(e.currentTarget.value))} defaultValue={classRoom.chairs[current].sizeY} placeholder="Storlek på namnet Y" type="number" name="sizeY" id="sizeY" />
                                <input ref={forceRef} onChange={(e)=>changeChairForce(current, !classRoom.chairs[current].force)} defaultChecked={classRoom.chairs[current].force} placeholder="Tvinga slumpvis person att hamna här" type="checkbox" name="force" id="force" />
                            </div> 
                            : <div>
                                <h2>Ingen person vald</h2>
                            </div>}
                        </div>}
                    </div>
                }
            </div>
            <div ref={wraperRef} className="StolParentWrapper">
                <div style={{transform:"translate(-50%,-50%) scale(" + scale + ")"}} ref={stolParentRef} className="StolParent" onMouseMove={(e)=>{setMousePos({x:e.clientX,y:e.clientY})}}>
                    {classRoom.chairs.map((item,index)=>{
                        return(
                            <Stol 
                                force={item.force} 
                                name={names.names[index].firstName} 
                                pos={{x:item.x,y:item.y}} 
                                size={{x:item.sizeX,y:item.sizeY}} 
                                key={index}
                                changeChairPos={changeChairPos}
                                current={current}
                                setCurrent={updateCurrentSelected}
                                index={index}
                                mousePos={mousePos}
                                grid={grid}
                                offset={offset}
                                scale={scale}
                                changeChairForce={changeChairForce}
                                editMode={editMode}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Drawer
