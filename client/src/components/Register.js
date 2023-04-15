import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom'
import axios from "axios";

const Register = () => {

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setData({...data, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = "http://localhost:5000/api/user/register"
            const {data:res} = await axios.post(url, data)
            navigate("/api/user/login")
            console.log(res.message)
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }
    

    return (
        <div className="App">
            <nav>
                <ul>
                    <li><strong>ToDo List Simplified</strong></li>
                </ul>
            </nav>
            <h2 style={{textAlign: "center"}}>Rejestracja</h2>
            <form style={{textAlign: "center"}} onSubmit={handleSubmit}>
                <label className="label" htmlFor="email">E-mail:</label>
                <input style={{width: '70%',display: 'inline-block',margin: 'auto', marginBottom:'1%'}} type="email" placeholder="Podaj E-mail" name="email" id="email" value={data.email} onChange={handleChange}/>
                <br />
                <label className="label" htmlFor="password">Hasło:</label>
                <input style={{width: '70%',display: 'inline-block',margin: 'auto'}} type="password" placeholder="Podaj hasło" name="password" id="" value={data.password} onChange={handleChange}/>
                <br />
                {error && <div>{error}</div>}
                <button className="btn-login-register" type="submit">Zarejestruj się</button>
            </form>

            <p style={{textAlign: "center"}}>Jeśli masz już konto, przejdź do <Link to="/api/user/login">Logowania</Link></p>
        </div>
    )
}

export default Register