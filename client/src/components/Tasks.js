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

//wyświetlanie

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

//dodawanie

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

//usuwanie

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
                    console.log(res)
                } )
                
                setTasks(tasks => tasks.filter(task => task._id !== data._id))
                getTasks()
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

//obsługa formularza

    const handleChange = (e) => {
        setData({...data, [e.target.name]:e.target.value})
    }

//wylogowanie

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location = "/"
    }


//edytowanie

    const [editState, setEditState] = useState("")
 
    const handleEditTask = async (id) => {
        console.log(id)
        setEditState(id)
    }

    const handleEditChange = (e) => {

        const newTasks = tasks.map(task => (
            task._id === editState ? {...task, [e.target.name] : e.target.value} : task
        ))
        setTasks(newTasks)
    }

    const handleSave = async (task) => {

        const url = `http://localhost:5000/api/tasks/edit/`

        const id = task._id

        try
        {
            await axios.put(url + `${id}`, {
                "_id": task._id,
                "title": task.title,
                "description": task.description
                },{
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json'
                }})

                getTasks()
                setEditState("")
                setError("")
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
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
                    editState === task._id ? 

                    <div key={task._id}>
                        <input type="text"  name="title" id="title" value={task.title} onChange={handleEditChange}/>
                        <input type="text" name="description" id="description" value={task.description} onChange={handleEditChange}/>
                        {error && <div>{error}</div>}
                        <button className="edit-task" onClick={() => handleSave(task)}>Zapisz</button>
                        <hr />
                    </div>
                    :
                    <div className={'task'} key={task._id}>
                      <div className="text"> {task.title}</div>
                      <div className="text"> {task.description}</div>
                      <input type="checkbox"  value="" name="" id="" />Zrobione!
                      <br/>
                      <button onClick={() => handleEditTask(task._id)} className="edit-task">Edytuj</button>
                      <button onClick={() => handleDeleteTask(task._id)} className="delete-task">Usuń</button>
                      <hr />
                    </div>
                ))}
            </div>  
        </div>
    )
}

export default Tasks