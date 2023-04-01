import React from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import AfterLogin from './components/AfterLogin'

function App () {

    const user = localStorage.getItem("token");
    return (
      <div>
        <Routes>
          {user && <Route path="/" exact element={<AfterLogin/>}/>}
          <Route path="/api/user/register" exact element={<Register/>}/>
          <Route path="/api/user/login" exact element={<Login/>}/>
          <Route path="/" element={<Navigate replace to="/api/user/login"/>}/>
          <Route path="//api/user/" element={<Navigate replace to="/api/user/login"/>}/>
        </Routes>
      </div>
    );

}

export default App;
