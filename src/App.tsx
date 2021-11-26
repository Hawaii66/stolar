import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { emptyTeacher } from './Interfaces/User';
import StolarRoutes from './Routes/StolarRoutes';

require('dotenv').config()

function App() {
  const [teacher,setTeacher] = useState(emptyTeacher);
  const [classRoomID, setClassRoomID] = useState("");
  const [namesID, setNamesID] = useState("");

  return (
    <Router>
      <StolarRoutes classRoomID={classRoomID} namesID={namesID} setClassRoomID={setClassRoomID} setNamesID={setNamesID} teacher={teacher} setTeacher={setTeacher}/>
    </Router>
  );
}

export default App;
