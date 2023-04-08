import React, {useState} from "react";
import axios from 'axios'
import {Link} from 'react-router-dom'


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
            .catch(err => console.error(err))
            // , {headers: {'Authorization': `Bearer ${res.data.accessToken}`}}
            // window.location = "/api/tasks/"
            // console.log(res.message)
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
        <div>
            <h1 style={{textAlign: "center"}}>Zaloguj się</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail:</label>
                <input type="email" placeholder="Podaj email" name="email" id="email" value={data.email} onChange={handleChange}/>
                <br />
                <label htmlFor="password">Hasło:</label>
                <input type="password" placeholder="Podaj hasło" name="password" id="" value={data.password} onChange={handleChange}/>
                <br />
                {error && <div>{error}</div>}
                <button type="submit">Zaloguj się</button>
            </form>

            <p style={{textAlign: "center"}}>Jeśli nie masz konta <Link to="/api/user/register">Zarejestruj się</Link></p>
        </div>
    )
}

export default Login