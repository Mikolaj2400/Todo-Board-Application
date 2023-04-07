import React, {useState, useEffect} from "react";
import axios from "axios";



const Tasks = () => {

    const authToken = localStorage.getItem("token")

    const [tasks, setTasks] = useState([])
    const [error, setError] = useState([])
    const [data, setData] = useState({
        title: "",
        description: ""
    })

    useEffect (() => {

        getTasks()
      }, [])


    const getTasks = async () => {
        
        
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
            })
            .catch(err => console.error("Error: ",err))
        } catch (error) {
            console.log(error)
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
                console.log(localStorage)
            }
        }
    }

    const handleAddingTask = async (e) => {
        e.preventDefault()
        const url = "http://localhost:5000/api/tasks/add"

        try{
            await axios.post(url, data, {
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json'
                }})
                .then(res => {
                    setTasks([...tasks, res.data])
                    console.log(res)
                })
                
                setData({
                    title: "",
                    description: "" 
                })

                setError("")
        } catch(error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

    const handleDeleteTask = async (id) => {
        const url = `http://localhost:5000/api/tasks/delete/`

        try
        {
            await axios.delete(url + `${id}`,{
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json'
                }})
                .then(res => {
                    setTasks([...tasks, res.data])
                } )
                
                setTasks(tasks => tasks.filter(task => task._id !== data._id))
                getTasks()
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

    const handleEditTask = async (id) => {
        
    }

    const handleChange = (e) => {
        setData({...data, [e.target.name]:e.target.value})
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
                <h3>Dodaj nowe zadanie</h3>
                <form onSubmit={handleAddingTask}>
                    <label htmlFor="text">Podaj nazwę zadania:</label>
                    <input type="text" placeholder="Wpisz nazwę" name="title" id="title" value={data.title} onChange={handleChange}/>
                    <br />
                    <label htmlFor="text">Podaj opis zadania:</label>
                    <input type="text" placeholder="Wpisz opis" name="description" id="description" value={data.description} onChange={handleChange}/>
                    <br />
                    {error && <div>{error}</div>}
                    <button type="submit">Dodaj zadanie</button>
                </form>
            </div>
            

            <div>
                <h1>Welcome!</h1>
                <h4>Twoje zadania</h4>
                {tasks.length === 0 && <div>Brak tasków!</div>}
                {tasks && tasks.map(task => (
                    <div className={'task'} key={task._id}>
                      <div className="text"> {task.title}</div>
                      <div className="text"> {task.description}</div>
                      <button onClick={() => handleEditTask(task._id)} className="edit-task">Edytuj</button>
                      <button onClick={() => handleDeleteTask(task._id)} className="delete-task">x</button>
                      <hr />
                    </div>
                ))}
            </div>
            
        </div>
    )
}


export default Tasks