import React from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Drawer from '../Components/Draw/Drawer'
import Home from '../Components/Home/Home'
import Microsoft from '../Components/Microsoft'
import PreDraw from '../Components/PreDraw/PreDraw'
import { Teacher } from '../Interfaces/User'

interface Props{
    teacher:Teacher,
    setTeacher:React.Dispatch<React.SetStateAction<Teacher>>,
    setClassRoomID:React.Dispatch<React.SetStateAction<string>>,
    setNamesID:React.Dispatch<React.SetStateAction<string>>,
    namesID:string,
    classRoomID:string
}

function StolarRoutes({teacher,setTeacher,setNamesID,setClassRoomID,namesID,classRoomID}:Props) {

    var location = useLocation();
    var navigate = useNavigate();
    if(location.pathname === "/predraw" && classRoomID !== "" && namesID !== ""){
        navigate("/draw");
    }

    return (
        <div>
            <Routes>
                <Route path="/login" element={<Microsoft setTeacher={setTeacher}/>}/>
                <Route path="/predraw" element={<PreDraw setTeacher={setTeacher} teacher={teacher} setClassRoomID={setClassRoomID} setNamesID={setNamesID} />}/>
                <Route path="/draw" element={<Drawer classRoomID={classRoomID} namesID={namesID}/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
            {teacher.active === false && <Microsoft setTeacher={setTeacher}/>}
        </div>
    )
}

export default StolarRoutes
