import React, { useRef, useEffect } from 'react'
import { Col, Container, Row, Form, InputGroup, FormControl, Button } from 'react-bootstrap'
import { EditModes, Modes } from './Drawer'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Names, ClassRoom, Pos } from '../../Interfaces/Classroom';

interface Props {
    mode:Modes,
    editMode:EditModes,
    current:number,
    currentLecture:number,
    classRoom:ClassRoom,
    names:Names,
    grid:Pos,
    changeEditMode:React.Dispatch<React.SetStateAction<EditModes>>,
    changeMode:React.Dispatch<React.SetStateAction<Modes>>,
    changeGrid:React.Dispatch<React.SetStateAction<Pos>>,
    changeClassRoom:React.Dispatch<React.SetStateAction<ClassRoom>>,
}

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

function Settings({mode,editMode,current,currentLecture,classRoom,names,grid,changeClassRoom,changeGrid,changeMode,changeEditMode}:Props) {
    const nameRef = useRef<HTMLInputElement>(null);
    const forceRef = useRef<HTMLInputElement>(null);
    const chairSizeX = useRef<HTMLInputElement>(null);
    const chairSizeY = useRef<HTMLInputElement>(null);
    const lectureRef = useRef<HTMLInputElement>(null);
    const lectureSizeX = useRef<HTMLInputElement>(null);
    const lectureSizeY = useRef<HTMLInputElement>(null);
    const gridX = useRef<HTMLInputElement>(null);
    const gridY = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(nameRef.current)
            nameRef.current.value = current >= names.names.length ? "" : names.names[current].firstName;
        if(forceRef.current)
            forceRef.current.checked = classRoom.chairs[current].force;
        if(chairSizeX.current)
            chairSizeX.current.value = classRoom.chairs[current].sizeX.toString();
        if(chairSizeY.current)
            chairSizeY.current.value  = classRoom.chairs[current].sizeY.toString();
        if(lectureRef.current)
            lectureRef.current.value = classRoom.lecterns[currentLecture].name;
        if(lectureSizeX.current)
            lectureSizeX.current.value = classRoom.lecterns[currentLecture].sizeX.toString();
        if(lectureSizeY.current)
            lectureSizeY.current.value = classRoom.lecterns[currentLecture].sizeY.toString();
        if(gridX.current)
            gridX.current.value = grid.x.toString();
        if(gridY.current)
            gridY.current.value = grid.y.toString();
    },[current,currentLecture, classRoom, grid, names])

    const changeForce = () => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[current].force = !tempClassRoom.chairs[current].force;
        changeClassRoom(tempClassRoom);
    }

    const changeSize = (x:number,y:number) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.chairs[current].sizeX = x;
        tempClassRoom.chairs[current].sizeY = y;

        changeClassRoom(tempClassRoom);
    }

    const changeLectureName = (name:string) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.lecterns[currentLecture].name = name;

        changeClassRoom(tempClassRoom);
    }

    const changeLectureSize = (x:number,y:number) => {
        var tempClassRoom:ClassRoom = {
            chairs:[...classRoom.chairs],
            lecterns:[...classRoom.lecterns],
            classRoomID:classRoom.classRoomID,
            name:classRoom.name
        }
        tempClassRoom.lecterns[currentLecture].sizeX = x;
        tempClassRoom.lecterns[currentLecture].sizeY = y;

        changeClassRoom(tempClassRoom);
    }

    return (
        <div style={{width:"40vw"}}>
            <Container>
                <Row style={{marginBottom:"0.5rem"}}>
                    <Col>
                        <Form.Select name="mode" id="mode" aria-label="Select mode" onChange={(e)=>changeMode(StringToMode(e.currentTarget.value))}>
                            <option value="View">Titta</option>
                            <option value="Edit">Ändra</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        {mode === Modes.Edit &&
                            <Form.Select aria-label="Välj läge" name="editMode" id="editMode" onChange={(e)=>changeEditMode(StringToEditMode(e.currentTarget.value))}>
                                 <option value="Move">Flytta stolar</option>
                                <option value="Properties">Egenskaper för stolar</option>
                            </Form.Select>
                        }
                    </Col>
                </Row>
                {mode === Modes.Edit &&
                    <>
                    <Row>
                        {editMode === EditModes.Move ? 
                            <>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id={"x"}>X</InputGroup.Text>
                                        <FormControl id="gridX" name="Grid X" onChange={(e)=>changeGrid({x:parseInt(e.currentTarget.value),y:grid.y})} placeholder="Grid X" ref={gridX} type="number" aria-label="X grid"/>
                                        <InputGroup.Text id={"y"}>Y</InputGroup.Text>
                                        <FormControl id="gridY" name="Grid Y" onChange={(e)=>changeGrid({y:parseInt(e.currentTarget.value),x:grid.x})} placeholder="Grid Y" ref={gridY} type="number" aria-label="Y grid"/>
                                    </InputGroup>
                                </Col>
                            </>
                        : current !== -1 ? 
                        <>
                            <Col>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Namn: </InputGroup.Text>
                                    <FormControl key={Math.random()} ref={nameRef} disabled aria-label="X grid" defaultValue={current >= names.names.length ? "" : names.names[current].firstName} />
                                    <InputGroup.Checkbox onChange={()=>changeForce()} name="force" id="force" key={Math.random()} defaultChecked={classRoom.chairs[current].force} aria-label="Checkbox for following text input" />
                                    <InputGroup.Text>Tvinga denna stol att få ett namn</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </> : currentLecture !== -1 ?
                        <>
                            <Col>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Namn: </InputGroup.Text>
                                    <FormControl onChange={(e)=>changeLectureName(e.currentTarget.value)} ref={lectureRef} aria-label="Namn" type="text" name="name" id="name" placeholder="Namn på kateden" defaultValue={currentLecture >= classRoom.lecterns.length ? "" : classRoom.lecterns[currentLecture].name} />
                                </InputGroup>
                            </Col>
                        </>:<>
                        
                        </>
                        }
                    </Row>
                    <Row>
                        {editMode === EditModes.Move ? 
                            <>
                                <Col>
                                    <Button style={{width:"100%"}}>123</Button>
                                </Col>
                                <Col>
                                    <Button style={{width:"100%"}}>123</Button>
                                </Col>
                            </>
                        : current !== -1 ? 
                        <>
                            <Col>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>X</InputGroup.Text>
                                    <FormControl onChange={(e)=>changeSize(parseInt(e.currentTarget.value),classRoom.chairs[current].sizeY)} name="sizeX" id="sizeX" placeholder="Size X" ref={chairSizeX} defaultValue={classRoom.chairs[current].sizeX} type="number" aria-label="X grid" />
                                    <InputGroup.Text>Y</InputGroup.Text>
                                    <FormControl onChange={(e)=>changeSize(classRoom.chairs[current].sizeX,parseInt(e.currentTarget.value))} name="sizeY" id="sizeY" placeholder="Size Y" ref={chairSizeY} defaultValue={classRoom.chairs[current].sizeY} type="number" aria-label="Y grid" />
                                </InputGroup>
                            </Col>
                        </> : currentLecture !== -1 ?
                        <>
                            <Col>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>X</InputGroup.Text>
                                    <FormControl onChange={(e)=>changeLectureSize(parseInt(e.currentTarget.value),classRoom.lecterns[currentLecture].sizeY)} name="sizeX" id="sizeY" placeholder="Size X" ref={lectureSizeX} defaultValue={classRoom.lecterns[currentLecture].sizeX} type="number" aria-label="X grid" />
                                    <InputGroup.Text>Y</InputGroup.Text>
                                    <FormControl onChange={(e)=>changeLectureSize(classRoom.lecterns[currentLecture].sizeX,parseInt(e.currentTarget.value))} name="sizeY" id="sizeY" placeholder="Size Y" ref={lectureSizeY} defaultValue={classRoom.lecterns[currentLecture].sizeY} type="number" aria-label="Y grid" />
                                </InputGroup>
                            </Col>
                        </>:<>
                        
                        </>}
                    </Row>
                    <Row style={{marginTop:"0.5rem"}}>
                        {editMode === EditModes.Move ? 
                            <>
                                <Col>
                                    <Button style={{width:"100%"}}>123</Button>
                                </Col>
                                <Col>
                                    <Button style={{width:"100%"}}>123</Button>
                                </Col>
                            </>
                        : current !== -1 ? 
                        <>
                            <Col>
                            </Col>
                        </> : currentLecture !== -1 ?
                        <>
                            
                        </>:<>
                        
                        </>}
                    </Row>
                    </>
                }
            </Container>
        </div>
    )
}

export default Settings
