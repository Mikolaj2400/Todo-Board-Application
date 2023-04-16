import React, {useState, useEffect} from "react";
import axios from "axios";

const Tasks = () => {

    const authToken = localStorage.getItem("token")

    const [tasks, setTasks] = useState([])
    const [error, setError] = useState([])
    const [editError, setEditError] = useState([])
    const [data, setData] = useState({
        title: "",
        description: "",
        is_habit: false
    })

    //wyświetlanie i renderowanie taskow i nawyków

    useEffect (() => {

        getTasks()        
      }, [])


    useEffect (() => {

        const intervalId = setInterval(() => {
            const now = new Date();
                if (now.getHours() === 0 && now.getMinutes() === 1) {
                    handleHabitChange()
                }
        }, 60000); // interwał co minutę
            return () => clearInterval(intervalId);
    }, [tasks])



    const handleHabitChange = async () => {
        console.log("wywolano")

        const updatedTasks = tasks.map (task => {
            if (task.is_habit && task.completed) {
                handleCompleteTask(task)
                return {
                  ...task,
                  completed: false,
                };
              }
              return task;
        })
        setTasks(updatedTasks)
    }



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
        setEditStateTask(id)
        setEditStateHabit('')
    }

    const handleEditHabit = async (id) => {
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
                setEditError("")
        } catch (error) {
            if(error.response && error.response.status >= 400 && error.response.status <= 500) {
                setEditError(error.response.data.message)
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
                    <li style={{color:'white'}}><b>ToDo List Simplified</b></li>
                </ul>
                <ul>
                    <li><button onClick={handleLogout}>Wyloguj się</button></li>
                </ul>
            </nav>

            <div style={{alignItems:"center", justifyContent:'center', marginTop:'2%'}}>
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
            {tasks.length === 0 && <h2  style={{textAlign: "center"}}>Brak zadań i nawyków!</h2>}
            {tasks.length > 0 &&
                <div style={{width:'50%', float:'left'}}>
                    <h4 className="header">Twoje zadania</h4>
                    <hr />
                    {tasks && tasks.map(task => (
                        editStateTask === task._id ? 

                        <div style={{textAlign: "center"}} key={task._id}>
                            <input type="text" style={{marginBottom:'1%'}}  name="title" placeholder="Podaj nazwę" id="title" value={task.title} onChange={handleEditTaskChange}/>
                            <input type="text"   name="description" placeholder="Podaj opis" id="description" value={task.description} onChange={handleEditTaskChange}/>
                            {editError && <div>{editError}</div>}
                            <button style={{display: 'inline-block',  width: '30%', margin: '2%', padding: '3%'}} onClick={() => handleSave(task)}>Zapisz</button>
                            <hr />
                        </div>
                        :

                        !task.is_habit ?

                        <div style={{textAlign: "center", marginRight:'1%'}} className={'task ' + (task.completed ? "is-complete": "")} key={task._id}>
                            <div style={{textAlign: "left"}} className="text title" > {task.title}</div>
                            <div style={{textAlign: "left"}} className="text description"> {task.description} {!task.description && <p></p>}</div>
                            <br/>
                            {!task.completed && 
                            <div>
                                <button onClick={() => handleCompleteTask(task)} className="btn-tasks">✓</button>
                                <button onClick={() => handleEditTask(task._id)} className="btn-tasks">✎</button>
                                <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">🗑</button>               
                            </div>}

                            {task.completed && 
                            <div>
                                <button onClick={() => handleCompleteTask(task)} className="btn-tasks">X</button>
                                <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">🗑</button>
                                <p>Zadanie wykonane</p>
                            </div>}
                            <hr />
                        </div>
                        :
                        ''
                    ))}
                </div>
                }




                {tasks.length > 0 &&
                <div style={{width:'50%', float:'left'}}>
                    <h4  className="header">Twoje nawyki</h4>
                    <hr />
                    {tasks && tasks.map(task => (
                        editStateHabit === task._id ?

                        <div  style={{textAlign: "center"}} key={task._id}>
                            <input type="text" style={{marginBottom:'1%'}}  name="title" placeholder="Podaj nazwę" id="title" value={task.title} onChange={handleEditHabitChange}/>
                            <input type="text" name="description" placeholder="Podaj opis" id="description" value={task.description} onChange={handleEditHabitChange}/>
                            {editError && <div>{editError}</div>}
                            <button style={{display: 'inline-block',  width: '30%', margin: '2%', padding: '3%'}} onClick={() => handleSave(task)}>Zapisz</button>
                            <hr />
                        </div>
                        :

                        task.is_habit ?

                        <div style={{textAlign: "center"}} className={'task ' + (task.completed ? "is-complete": "")} key={task._id}>
                            <div style={{textAlign: "left", }} className="text title"> {task.title}</div>
                            <div style={{textAlign: "left"}} className="text description">{task.description} {!task.description && <p></p>}</div>
                            <br />
                            {!task.completed &&
                            <div>
                                <button onClick={() => handleCompleteTask(task)} className="btn-tasks">✓</button>
                                <button onClick={() => handleEditHabit(task._id)} className="btn-tasks">✎</button>
                                <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">🗑</button>
                            </div>}
                            {task.completed && 
                                <div>
                                    <button onClick={() => handleCompleteTask(task)} className="btn-tasks">X</button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="btn-tasks">🗑</button>
                                    <p>Nawyk wykonany!</p>
                                </div>}
                            <hr />
                        </div>
                        :
                        ''
                    ))}
                </div>
                }
                <footer style={{clear:'both', textAlign:'center'}}>
                    <hr />
                    <p>Copyright®</p> 
                </footer>
            </div>
        </div>
    )
}

export default Tasks