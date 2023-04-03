import React, {useState, useEffect} from "react";
import axios from "axios";



const Tasks = () => {

    const [tasks, setTasks] = useState([])
    const [error, setError] = useState([])

    useEffect (() => {

        getTasks()
      }, [])

    const getTasks = async () => {
        
        const authToken = localStorage.getItem("token")
        const url = "http://localhost:5000/api/tasks/"

        try 
        {
            await axios.get(url, { 
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json'
                }})
            .then(res => {
                setTasks(res.data)
                console.log(res.data)
            })
            .catch(err => console.error("Error: ",err))
        } catch (error) {
            console.log(error)
            // if(error.response && error.response.status >= 400 && error.response.status <= 500) {
            //     setError(error.response.data.message)
            //     console.log(localStorage)
            // }
        }
      }

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location = "/"
    }


    return (
        <div>
            <h1>Zalogowałeś się!</h1>
            <button onClick={handleLogout}>Wyloguj się</button>

            <div>
                <h1>Welcome!</h1>
                <h4>Your tasks</h4>
                {tasks.map(task => (
                    <div className={'todo ' + (task.completed ? "is-complete": "")} key={task._id}>
                      <div className="checkbox"></div>
                      <div className="text"> {task.title}</div>
                      <div className="text"> {task.description}</div>
                      <div className="delete-todo">x</div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Tasks