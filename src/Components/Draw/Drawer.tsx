import React, { useEffect, useRef, useState } from 'react'
import { Form, FormControl, InputGroup, Button, Card } from 'react-bootstrap';
import { ClassRoom, Names, Pos } from '../../Interfaces/Classroom'
import { GetClassRoom, SetClassRoomChairs } from '../../ServerRoutes';
import CustomModal from '../Utils/CustomModal';
import Lecturne from './Lecturne';
import Stol from './Stol'
import "./Stol.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Settings from './Settings';

export enum Modes {"View","Edit"}
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
    const divRef = useRef<HTMLDivElement>(null);
    const wraperRef = useRef<HTMLDivElement>(null);
    const sizeXRef = useRef<HTMLInputElement>(null);
    const sizeYRef = useRef<HTMLInputElement>(null);
    const forceRef = useRef<HTMLInputElement>(null);
    const sizeXLecternRef = useRef<HTMLInputElement>(null);
    const sizeYLecternRef = useRef<HTMLInputElement>(null);
    const nameLecternRef = useRef<HTMLInputElement>(null);

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

    const changeLecternSizeX = (x:number) => {
        changeLecternSize({
            x:x,
            y:classRoom.lecterns[currentLecture].sizeY
        })
    }

    const changeLecternSizeY = (y:number) => {
        changeLecternSize({
            y:y,
            x:classRoom.lecterns[currentLecture].sizeX
        })
    }

    const changeLecternSize = (pos:Pos) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.lecterns[currentLecture].sizeX = pos.x;
        tempClassRoom.lecterns[currentLecture].sizeY = pos.y;
        setClassRoom(tempClassRoom);
    }

    const changeLecternName = (name:string) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.lecterns[currentLecture].name = name;
        setClassRoom(tempClassRoom);
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
            lecterns:[...classRoom.lecterns],
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
        console.log(newScale);
        setScale(newScale); 
    }

    const updateCurrentLectureSelected = (i:number) => {
        setCurrentLecture(i);
        setCurrent(-1);
        if(i !== -1){
            if(sizeXLecternRef === null || sizeXLecternRef === undefined || sizeXLecternRef.current === undefined || sizeXLecternRef.current === null){
            }else{
                sizeXLecternRef.current.value = classRoom.chairs[i].sizeX.toString();
            }

            if(sizeYLecternRef === null || sizeYLecternRef === undefined || sizeYLecternRef.current === undefined || sizeYLecternRef.current === null){
            }else{
                sizeYLecternRef.current.value = classRoom.chairs[i].sizeX.toString();
            }
        }
    }

    const updateCurrentSelected = (i:number) => {
        setCurrent(i);
        setCurrentLecture(-1);
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
    }, []);

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
            <Settings 
                    mode={mode} 
                    editMode={editMode}
                    current={current}
                    currentLecture={currentLecture}
                    classRoom={classRoom}
                    names={names}
                    grid={grid}
                    changeMode={setMode}
                    changeEditMode={setEditMode}
                    changeGrid={setGrid}
                    changeClassRoom={setClassRoom}
                />
            <div className="FormParent">
                
                <Form.Select aria-label="Välj läge" name="mode" id="mode" onChange={(e)=>setMode(StringToMode(e.currentTarget.value))}>
                    <option value="View">Titta</option>
                    <option value="Edit">Ändra</option>
                </Form.Select>
                {mode === Modes.Edit && 
                    <div ref={divRef} className="FormSettings">
                        <Form.Select className="FormSettingsMode" aria-label="Välj läge" name="editMode" id="editMode" onChange={(e)=>setEditMode(StringToEditMode(e.currentTarget.value))}>
                            <option value="Move">Flytta stolar</option>
                            <option value="Properties">Egenskaper för stolar</option>
                        </Form.Select>
                        {editMode === EditModes.Move && <Card className="MoveCard">
                            <Card.Body>
                        {["X","Y"].map((item,index)=>{
                            return(
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id={item}>{item}</InputGroup.Text>
                                    <FormControl
                                    placeholder={`${item} grid`}
                                    aria-label={`${item} grid`}
                                    onChange={(e)=>setGrid(item === "X" ? {x:parseInt(e.currentTarget.value),y:grid.y} : {y:parseInt(e.currentTarget.value),x:grid.x})}
                                    type="number"
                                    name={`grid${item}`}
                                    id={`grid${item}`}
                                    />
                                </InputGroup>
                            )
                        })}
                        </Card.Body>
                        <Button onClick={()=>AddChair()} variant="light">Lägg till en stol</Button>{' '}
                        <Button onClick={()=>AddLectern()} variant="light">Lägg till en kated</Button>{' '}
                        <Button onClick={()=>setShowModal(true)} variant="light">Ladda Layout</Button>{' '}
                        <Button onClick={()=>SaveLayout()} variant="light">Spara Layout</Button>{' '}
                        </Card>}
                        {editMode === EditModes.Properties && <div>
                            {current !== -1 ? <div>
                                <h3>{current >= names.names.length ? "" : names.names[current].firstName}</h3>
                                {["X","Y"].map((item,index)=>{
                                return(
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id={item}>{item}</InputGroup.Text>
                                        <FormControl
                                        ref={item === "X" ? sizeXRef : sizeYRef}
                                        placeholder={`Storlek på namnet ${item}"`}
                                        aria-label={`${item} kordinat`}
                                        onChange={(e)=>changeChairSize(item === "X" ? {x:parseInt(e.currentTarget.value),y:classRoom.chairs[current].y} : {y:parseInt(e.currentTarget.value),x:classRoom.chairs[current].x})}
                                        type="number"
                                        name={`size${item}`}
                                        id={`size${item}`}
                                        defaultValue={item === "X" ? classRoom.chairs[current].sizeX : classRoom.chairs[current].sizeY}
                                       />
                                    </InputGroup>
                                )
                                })}
                                <Form.Check
                                    ref={forceRef} 
                                    onChange={(e)=>changeChairForce(current, !classRoom.chairs[current].force)}
                                    defaultChecked={classRoom.chairs[current].force}
                                    placeholder="Tvinga slumpvis person att hamna här" 
                                    type="checkbox" 
                                    name="force" 
                                    id="force"
                                    label="Tvinga stolen att få ett namn"
                                />
                            </div> 
                            : currentLecture !== -1 ? <div>
                                <h3>{currentLecture >= classRoom.lecterns.length ? "" : classRoom.lecterns[currentLecture].name}</h3>
                                
                                {["X","Y"].map((item,index)=>{
                                return(
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id={item}>{item}</InputGroup.Text>
                                        <FormControl
                                        ref={item === "X" ? sizeXLecternRef : sizeYLecternRef}
                                        placeholder={`Storlek på namnet ${item}"`}
                                        aria-label={`${item} kordinat`}
                                        onChange={(e)=>changeLecternSize(item === "X" ? {x:parseInt(e.currentTarget.value),y:classRoom.lecterns[currentLecture].y} : {y:parseInt(e.currentTarget.value),x:classRoom.lecterns[currentLecture].x})}
                                        type="number"
                                        name={`size${item}`}
                                        id={`size${item}`}
                                        key={index}
                                        defaultValue={item === "X" ? classRoom.lecterns[currentLecture].sizeX : classRoom.lecterns[currentLecture].sizeY}
                                       />
                                    </InputGroup>
                                )
                                })}
                                <Form.Control ref={nameLecternRef} onChange={(e)=>changeLecternName(e.currentTarget.value)} defaultValue={classRoom.lecterns[currentLecture].name} type="text" name="name" id="name" placeholder="Namn på katedern" />
                            </div> : <div>
                                <h2>Inget att visa</h2>
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
