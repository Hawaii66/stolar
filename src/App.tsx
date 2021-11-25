import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import StolarRoutes from './Routes/StolarRoutes';
import { emptyUser } from './Interfaces/User';

require('dotenv').config()

function App() {
  const [user,setUser] = useState(emptyUser);

  return (
    <Router>
      <StolarRoutes user={user} setUser={setUser}/>
    </Router>
  );
}

export default App;
