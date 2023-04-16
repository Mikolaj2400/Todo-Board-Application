import React, {useState} from "react";
import axios from 'axios'
import {Link} from 'react-router-dom'
import '../App.css';


const Login = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = "http://localhost:5000/api/user/login"
            await axios.post(url, data)
            .then(res => localStorage.setItem("token", res.data.accessToken, 
            {headers: {'Authorization': `Bearer ${res.data.accessToken}`}},
            window.location = "/api/tasks/")) 
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
                console.log(localStorage)
            }
        }
    }

    const handleChange = (e) => {
        setData({...data, [e.target.name]:e.target.value})
    }


    return (
        <div className="App">
            <nav>
                <ul>
                    <li style={{color:'white'}}><b>ToDo List Simplified</b></li>
                </ul>
            </nav>
            <div style={{textAlign: "center", marginTop:'3%', marginBottom:'7%'}}>
                <p style={{fontSize:'30px', color:'white'}}>
                    Na <b>ToDo List Simplified</b> zapisuj swoje Zadania i ćwicz swoje Nawyki!
                </p>
                <p style={{fontSize:'25px'}}><Link to="/api/user/register">Zarejestruj się za darmo już dziś!</Link></p>
            </div>
            <h2 style={{textAlign: "center"}}>Logowanie</h2>
            <form style={{textAlign: "center"}} onSubmit={handleSubmit}>
                <label className="label" htmlFor="email">E-mail:</label>
                <input style={{width: '70%',display: 'inline-block',margin: 'auto', marginBottom:'1%'}} type="email" placeholder="Podaj E-mail" name="email" id="email" value={data.email} onChange={handleChange}/>
                <br />
                <label className="label" htmlFor="password">Hasło:</label>
                <input style={{width: '70%',display: 'inline-block',margin: 'auto'}} type="password" placeholder="Podaj hasło" name="password" id="" value={data.password} onChange={handleChange}/>
                <br />
                {error && <div>{error}</div>}
                <button className="btn-login-register" type="submit">Zaloguj się</button>
            </form>
            <footer className="footer">
                    <hr />
                   <p>Copyright®</p> 
            </footer>
        </div>

    )
}

export default Login