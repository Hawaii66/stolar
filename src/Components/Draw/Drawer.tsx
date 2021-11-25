import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ClassRoom, Names, Pos } from '../../Interfaces/Classroom'
import { GetClassRoom, SetClassRoomChairs } from '../../ServerRoutes';
import Stol from './Stol'
import "./Stol.css";

enum Modes {"View","Edit"}

function StringToMode (s:string){
    if(s === "View"){
        return Modes.View;
    }
    if(s === "Edit"){
        return Modes.Edit;
    }
    return Modes.View;
}

function Drawer() {
    const [current,setCurrent] = useState(-1);
    const [mousePos,setMousePos] = useState<Pos>({x:0,y:0});
    const [grid,setGrid] = useState<Pos>({x:1,y:1});
    const [offset,setOffset] = useState<Pos>({x:0,y:0});
    const [mode,setMode] = useState<Modes>(Modes.View);
    const [scale,setScale] = useState(1);
    const [classRoom,setClassRoom] = useState<ClassRoom>({
        classRoomID:"5327389257325",
        name:"Sal 1",
        chairs:[
            {
                x:0,
                y:0,
                force:true,
                sizeX:80,
                sizeY:40
            },{
                x:100,
                y:0,
                force:true,
                sizeX:80,
                sizeY:40
            },{
                x:200,
                y:0,
                force:false,
                sizeX:80,
                sizeY:40
            },{
                x:0,
                y:60,
                force:true,
                sizeX:80,
                sizeY:40
            },{
                x:100,
                y:60,
                force:false,
                sizeX:80,
                sizeY:100
            },
        ]
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
        <div >
            <div >
                <select name="mode" id="mode" onChange={(e)=>setMode(StringToMode(e.currentTarget.value))}>
                    <option value="View">Titta</option>
                    <option value="Edit">Ändra</option>
                </select>
                {mode === Modes.Edit && 
                    <div ref={divRef}>
                        <input onChange={(e)=>setGrid({x:parseInt(e.currentTarget.value),y:grid.y})} type="number" name="gridX" id="gridX" />
                        <input onChange={(e)=>setGrid({y:parseInt(e.currentTarget.value),x:grid.x})} type="number" name="gridY" id="gridY" />
                        <button onClick={()=>AddChair()}>Lägg till Stol</button>
                        <button onClick={()=>getClassRoomData()}>Ladda Stolar</button>
                        <button onClick={()=>SaveLayout()}>Spara Stolar</button>
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
                                classRoom={classRoom}
                                changeChairPos={changeChairPos}
                                current={current}
                                setCurrent={setCurrent}
                                index={index}
                                mousePos={mousePos}
                                grid={grid}
                                offset={offset}
                                scale={scale}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Drawer
