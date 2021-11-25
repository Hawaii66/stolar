import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Drawer from '../Components/Draw/Drawer'
import Home from '../Components/Home/Home'
import Microsoft from '../Components/Microsoft'
import { User } from '../Interfaces/User'

interface Props{
    user:User,
    setUser:React.Dispatch<React.SetStateAction<User>>
}

function StolarRoutes({user,setUser}:Props) {

    return (
        <div>
            <Routes>
                <Route path="/login" element={<Microsoft setUser={setUser}/>}/>
                <Route path="/draw" element={<Drawer/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
            {user.active === false && <Microsoft setUser={setUser}/>}
        </div>
    )
}

export default StolarRoutes
