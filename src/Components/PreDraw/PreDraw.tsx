import React, { useRef } from 'react'
import { Button, Col, Form, FormControl, InputGroup } from 'react-bootstrap'
import { Teacher } from '../../Interfaces/User'
import { AddClassRoom, AddGroup, CreateClassRoom, CreateGroup } from '../../ServerRoutes';

interface Props{
    setClassRoomID:React.Dispatch<React.SetStateAction<string>>
    setNamesID:React.Dispatch<React.SetStateAction<string>>
    setTeacher:React.Dispatch<React.SetStateAction<Teacher>>
    teacher:Teacher
}

function PreDraw({setClassRoomID,setNamesID,teacher,setTeacher}:Props) {
    const classRoomNameRef = useRef<HTMLInputElement>(null);
    const groupNameRef = useRef<HTMLInputElement>(null);

    const createNewClassRoom = () => {
        if(classRoomNameRef === null || classRoomNameRef.current === null){
            return;
        }

        const toSend = {
            name:classRoomNameRef.current.value
        }

        fetch(CreateClassRoom,{
            method:"POST",
            body:JSON.stringify(toSend),
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            const toSend = {
                teacherID:teacher.accountID,
                classRoomID:data.data.classRoomID
            }

            fetch(AddClassRoom,{
                method:"POST",
                body:JSON.stringify(toSend),
                headers:{
                    "content-type":"application/json"
                } 
            }).then(res=>res.json().then(data=>{
                setTeacher(data.data);
                if(classRoomNameRef === null || classRoomNameRef.current === null){
                    return;
                }

                classRoomNameRef.current.value = "";
            }));
        }));
    }

    const createNewGroup = () => {
        if(groupNameRef === null || groupNameRef.current === null){
            return;
        }

        const toSend = {
            name:groupNameRef.current.value
        }

        fetch(CreateGroup,{
            method:"POST",
            body:JSON.stringify(toSend),
            headers:{
                "content-type":"application/json"
            }
        }).then(res=>res.json().then(data=>{
            const toSend = {
                teacherID:teacher.accountID,
                groupID:data.data.namesID
            }

            fetch(AddGroup,{
                method:"POST",
                body:JSON.stringify(toSend),
                headers:{
                    "content-type":"application/json"
                } 
            }).then(res=>res.json().then(data=>{
                setTeacher(data.data);
                if(groupNameRef === null || groupNameRef.current === null){
                    return;
                }

                groupNameRef.current.value = "";
            }));
        }));
    }

    return (
        <div style={{width:"30vw",margin:"1rem"}}>
            <Col>
                <Form.Select name="mode" id="mode" aria-label="Select mode" onChange={(e)=>setClassRoomID(e.currentTarget.value)} >
                    <option value={""}>{"Välj sal"}</option>
                    {teacher.classRoomIDs.map((item,index)=>{
                        return(
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                    })}
                </Form.Select>
                <InputGroup className="m-3 ms-0">
                    <InputGroup.Text id="nameText">Skapa en ny sal</InputGroup.Text>
                    <FormControl ref={classRoomNameRef} id="name" name="name" placeholder="Namn på salen" type="text" aria-label="Name"/>
                    <Button variant="outline-secondary" onClick={createNewClassRoom}>Skapa</Button>
                </InputGroup>
            </Col>
            <Col>
                <Form.Select name="mode" id="mode" aria-label="Select mode" onChange={(e)=>setNamesID(e.currentTarget.value)} >
                    <option value={""}>{"Välj grupp"}</option>
                    {teacher.groupIDs.map((item,index)=>{
                        return(
                            <option value={item.id}>{item.name}</option>
                        )
                    })}
                </Form.Select>
                <InputGroup className="m-3 ms-0">
                    <InputGroup.Text id="groupText">Skapa en ny grupp</InputGroup.Text>
                    <FormControl ref={groupNameRef} id="group" name="group" placeholder="Namn på gruppen" type="text" aria-label="Grupp"/>
                    <Button variant="outline-secondary" onClick={createNewGroup}>Skapa</Button>
                </InputGroup>
            </Col>
        </div>
    )
}

export default PreDraw
