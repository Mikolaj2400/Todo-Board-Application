import React from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Tasks from './components/Tasks'

function App () {

    const user = localStorage.getItem("token");
    return (
      <div>
        <Routes>
          {user && <Route path="/api/tasks/" exact element={<Tasks/>}/>}
          <Route path="/api/user/register" exact element={<Register/>}/>
          <Route path="/api/user/login" exact element={<Login/>}/>
          <Route path="/" element={<Navigate replace to="/api/user/login"/>}/>
          <Route path="/api/user/" element={<Navigate replace to="/api/user/login"/>}/>
        </Routes>
      </div>
    );

}

export default App;
