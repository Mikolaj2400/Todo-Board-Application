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
        <div className="App">
            <nav>
                <ul>
                    <li><strong>ToDo List Simplified</strong></li>
                </ul>
            </nav>
            <p style={{textAlign: "center", marginTop:'1%'}}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                Vero numquam accusantium molestias recusandae error iusto nesciunt reiciendis laborum repellat sint, veniam ad quaerat atque commodi autem! Quo error adipisci vel.
            </p>
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

            <p style={{textAlign: "center"}}>Jeśli nie masz konta <Link to="/api/user/register">Zarejestruj się</Link></p>
        </div>
    )
}

export default Login