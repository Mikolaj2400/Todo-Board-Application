import React, {useState, useEffect} from "react";
import axios from "axios";



const Tasks = () => {

    const authToken = localStorage.getItem("token")

    const [tasks, setTasks] = useState([])
    const [error, setError] = useState([])
    const [data, setData] = useState({
        title: "",
        description: "",
        is_habit: false
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
                    description: "",
                    is_habit: false 
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
        const type = e.target.type
        if(type === "text"){
            setData({...data, [e.target.name]:e.target.value})
        } else if (type === "checkbox") {
            setData({...data, [e.target.name]:e.target.checked})
        }
 
    }

//wylogowanie

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location = "/"
    }


//edytowanie

    const [editStateTask, setEditStateTask] = useState("")
    const [editStateHabit, setEditStateHabit] = useState("")
 
    const handleEditTask = async (id) => {
        console.log(id)
        setEditStateTask(id)
        setEditStateHabit('')
    }

    const handleEditHabit = async (id) => {
        console.log(id)
        setEditStateHabit(id)
        setEditStateTask('')
    }

    const handleEditTaskChange = (e) => {

        const newTasks = tasks.map(task => (
            task._id === editStateTask ? {...task, [e.target.name] : e.target.value} : task
        ))
        setTasks(newTasks)
    }

    const handleEditHabitChange = (e) => {

        const newTasks = tasks.map(task => (
            task._id === editStateHabit ? {...task, [e.target.name] : e.target.value} : task
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
                setEditStateTask("")
                setEditStateHabit("")
                setError("")
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }

//zaznaczenie jako wykonane

    const handleCompleteTask = async (task) => {
        const url = `http://localhost:5000/api/tasks/complete/`
        const id = task._id

        try{
            await axios.put(url + `${id}`, {
                "completed":!task.completed
            }, {
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json'
                }})
                console.log(task.completed)

                getTasks()
                setError("")
        } catch(error) {
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
                <ul>
                    <li><button onClick={handleLogout}>Wyloguj się</button></li>
                </ul>
            </nav>

            <div style={{alignItems:"center", justifyContent:'center'}}>
                <h3 className="label">Dodaj nowe zadanie</h3>
                <form style={{textAlign: "center"}} onSubmit={handleAddingTask}>
                    <label className="label" htmlFor="text">Nazwa zadania:</label>
                    <input style={{width: '70%',display: 'inline-block',margin: 'auto', marginBottom:'1%'}} type="text" placeholder="Wpisz nazwę" name="title" id="title" value={data.title} onChange={handleChange}/>
                    <br />
                    <label className="label" htmlFor="text">Opis zadania:</label>
                    <input style={{width: '70%',display: 'inline-block',margin: 'auto'}} type="text" placeholder="Wpisz opis" name="description" id="description" value={data.description} onChange={handleChange}/>
                    <br />
                    <label className="checkbox">
                        Nawyk
                        <input style={{marginLeft:'1%'}} type="checkbox" checked={data.is_habit} name="is_habit" id="is_habit" onChange={handleChange} />
                    </label>
                    {error && <div>{error}</div>}
                    <button className="btn-login-register" type="submit">Dodaj zadanie</button>
                </form>
            </div>
            
            <div style={{marginTop:'15%'}}>
                <div style={{width:'50%', float:'left', borderRight:'solid 1px white'}}>
                    <h4 className="header">Twoje zadania</h4>
                    <hr />
                    {tasks.length === 0 && <div  style={{textAlign: "center"}}>Brak zadań!</div>}
                    {tasks && tasks.map(task => (
                        editStateTask === task._id ? 

                        <div style={{textAlign: "center"}} key={task._id}>
                            <input type="text"  name="title" placeholder="Podaj nazwę" id="title" value={task.title} onChange={handleEditTaskChange}/>
                            <input type="text" name="description" placeholder="Podaj opis" id="description" value={task.description} onChange={handleEditTaskChange}/>
                            {error && <div>{error}</div>}
                            <button className="btn-tasks" onClick={() => handleSave(task)}>Zapisz</button>
                            <hr />
                        </div>
                        :

                        !task.is_habit ?

                        <div style={{textAlign: "center"}} className={'task'} key={task._id}>
                            <div style={{textAlign: "left"}} className="title"> {task.title}</div>
                            <div style={{textAlign: "left"}} className="description"> {task.description}</div>
                            <br/>
                            <button onClick={() => handleCompleteTask(task)} className="btn-tasks">Done!</button>
                            <button onClick={() => handleEditTask(task._id)} className="btn-tasks">Edytuj</button>
                            <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">Usuń</button>
                            <hr />
                        </div>
                        :
                        ''
                    ))}
                </div>





                <div style={{width:'50%', float:'left'}}>
                    <h4  className="header">Twoje nawyki</h4>
                    <hr />
                    {tasks.length === 0 && <div  style={{textAlign: "center"}}>Brak nawyków!</div>}
                    {tasks && tasks.map(task => (
                        editStateHabit === task._id ?

                        <div style={{textAlign: "center"}} key={task._id}>
                            <input type="text"  name="title" placeholder="Podaj nazwę" id="title" value={task.title} onChange={handleEditHabitChange}/>
                            <input type="text" name="description" placeholder="Podaj opis" id="description" value={task.description} onChange={handleEditHabitChange}/>
                            {error && <div>{error}</div>}
                            <button className="btn-tasks" onClick={() => handleSave(task)}>Zapisz</button>
                            <hr />
                        </div>
                        :

                        task.is_habit ?

                        <div style={{textAlign: "center"}} className={'task'} key={task._id}>
                            <div style={{textAlign: "left" , marginLeft: '3%'}} className="text"> {task.title}</div>
                            <div style={{textAlign: "left" , marginLeft: '3%'}} className="text"> {task.description}</div>
                            <br/>
                            <button onClick={() => handleCompleteTask(task)} className="btn-tasks">Done!</button>
                            <button onClick={() => handleEditHabit(task._id)} className="btn-tasks">Edytuj</button>
                            <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">Usuń</button>
                            <hr />
                        </div>
                        :
                        ''
                    ))}
                </div>
                <footer style={{clear:'both', textAlign:'center'}}>
                    Copyright
                </footer>
            </div>
        </div>
    )
}

export default Tasks