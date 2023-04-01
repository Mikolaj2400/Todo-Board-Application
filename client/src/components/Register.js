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
        <div>
            <h1>Zarejestruj się</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Podaj E-mail:</label>
                <input type="email" placeholder="email" name="email" id="email" value={data.email} onChange={handleChange}/>
                <br />
                <label htmlFor="password">Podaj hasło:</label>
                <input type="password" placeholder="Hasło" name="password" id="" value={data.password} onChange={handleChange}/>
                <br />
                {error && <div>{error}</div>}
                <button type="submit">Zarejestruj się</button>
            </form>

            <p>Jeśli masz już konto, przejdź do <Link to="/api/user/login">Logowania</Link></p>
        </div>
    )
}

export default Register