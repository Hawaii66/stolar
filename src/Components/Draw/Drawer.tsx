import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ClassRoom, Names, Pos } from '../../Interfaces/Classroom'
import { GetClassRoom, GetNames, SetClassRoomChairs } from '../../ServerRoutes';
import CustomModal from '../Utils/CustomModal';
import Lecturne from './Lecturne';
import Stol from './Stol'
import "./Stol.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Settings from './Settings';
import { useNavigate } from 'react-router';

export enum Modes {"View","Edit"}
export enum EditModes {"Move","Properties"}

interface Props{
    classRoomID:string,
    namesID:string
}

function Drawer({classRoomID,namesID}:Props) {
    const [current,setCurrent] = useState(-1);
    const [mousePos,setMousePos] = useState<Pos>({x:0,y:0});
    const [grid,setGrid] = useState<Pos>({x:1,y:1});
    const [offset,setOffset] = useState<Pos>({x:0,y:0});
    const [mode,setMode] = useState<Modes>(Modes.View);
    const [editMode,setEditMode] = useState<EditModes>(EditModes.Move);
    const [scale,setScale] = useState(1);
    const [showWarningModal, setShowModal] = useState(false);
    const [currentLecture,setCurrentLecture] = useState(-1);
    const [classRoom,setClassRoom] = useState<ClassRoom>({
        chairs:[],
        lecterns:[],
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
    const wraperRef = useRef<HTMLDivElement>(null);

    const setModeBefore = (mode:Modes) => {
        setCurrent(-1);
        setCurrentLecture(-1);
        setMode(mode);
    }

    const setEditModeBefore = (editMode:EditModes) => {
        setCurrent(-1);
        setCurrentLecture(-1);
        setEditMode(editMode);
    }

    const getClassRoomData = useCallback(() => {
        fetch(GetClassRoom + classRoomID, {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            setClassRoom(data.data);
        }));

        fetch(GetNames + namesID, {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            console.log(data);
            setNames(data.data)
        }));
    },[classRoomID,namesID]);
    
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
            lecterns:classRoom.lecterns,
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        })
    }

    const AddLectern = () => {
        var lecterns = [...classRoom.lecterns];
        lecterns.push({
            name:"",
            sizeX:100,
            sizeY:50,
            x:0,
            y:0
        });
        setClassRoom({
            chairs:classRoom.chairs,
            lecterns:lecterns,
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        })
    }

    const SaveLayout = () => {
        const data = {
            chairs: classRoom.chairs,
            lecterns: classRoom.lecterns
        }

        fetch(SetClassRoomChairs + classRoom.classRoomID, {
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            setClassRoom(data.data);
        }));
    }

    const changeChairPos = (index:number, pos:Pos) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
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
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[index].force = force;
        setClassRoom(tempClassRoom);
    }

    const changeLecturePos = (index:number, pos:Pos) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.lecterns[index].x = pos.x;
        tempClassRoom.lecterns[index].y = pos.y;
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
        setScale(newScale); 
    }

    const updateCurrentLectureSelected = (i:number) => {
        setCurrentLecture(i);
        setCurrent(-1);
    }

    const updateCurrentSelected = (i:number) => {
        setCurrent(i);
        setCurrentLecture(-1);
    }

    const modalButtonClicked = (i:number) => {
        if(i === -1){
            return;
        }

        if(i === 1){
            getClassRoomData();
            setShowModal(false);
        }
        if(i === 0){
            setShowModal(false);
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
    }, [getClassRoomData]);

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
    }, []);

    if(offset.x !== stolParentRef.current?.getBoundingClientRect().left || offset.y !== stolParentRef.current.getBoundingClientRect().top){
        if(stolParentRef === null || stolParentRef === undefined || stolParentRef.current === null){

        }else{
            setOffset({
                x:stolParentRef.current.getBoundingClientRect().left,
                y:stolParentRef.current.getBoundingClientRect().top
            });
        }
    }

    var navigate = useNavigate();
    if(classRoomID === "" || namesID === ""){
        navigate("/predraw");
    }

    return (
        <div className="Background">
            <div style={{paddingTop:"1rem"}}>
                <Settings 
                    mode={mode} 
                    editMode={editMode}
                    current={current}
                    currentLecture={currentLecture}
                    classRoom={classRoom}
                    names={names}
                    grid={grid}
                    changeMode={setModeBefore}
                    changeEditMode={setEditModeBefore}
                    changeGrid={setGrid}
                    changeClassRoom={setClassRoom}
                    addChair={()=>AddChair()}
                    addLectern={()=>AddLectern()}
                    saveLayout={()=>SaveLayout()}
                    setModal={()=>setShowModal(true)}
                />
            </div>
            <div className="br"></div>
            <div ref={wraperRef} className="StolParentWrapper">
                <div style={{transform:"translate(-50%,-50%) scale(" + scale + ")"}} ref={stolParentRef} className="StolParent" onMouseMove={(e)=>{setMousePos({x:e.clientX,y:e.clientY})}}>
                    {classRoom.chairs.map((item,index)=>{
                        return(
                            <Stol 
                                force={item.force} 
                                name={index >= names.names.length ? "" : names.names[index].firstName} 
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
                                mode={mode}
                            />
                        )
                    })}
                    {classRoom.lecterns.map((item,index)=>{
                        return(
                            <Lecturne 
                                name={item.name}
                                pos={{x:item.x,y:item.y}}
                                size={{x:item.sizeX,y:item.sizeY}}
                                key={index}
                                current={currentLecture}
                                index={index}
                                mousePos={mousePos}
                                grid={grid}
                                offset={offset}
                                scale={scale}
                                editMode={editMode}
                                changeLecturePos={changeLecturePos}
                                setCurrent={updateCurrentLectureSelected}
                            />
                        );
                    })}
                </div>
            </div>
            <CustomModal
                buttons={[{title:"Nej",variant:"warning"},{title:"Ok",variant:"success"}]}
                show={showWarningModal}
                title="Ladda Layout"
                buttonClicked={(i)=>modalButtonClicked(i)}
            >
                <p>Om du klickar på OK kommer alla ändringar du gjort efter förra sparningen att gå förlorade. Klicka på Nej om du inte vill att det ska ske!</p>
            </CustomModal>
        </div>
    )
}

export default Drawer
