const asyncHandler = require("express-async-handler")
const Task = require("../models/taskModel")
const dotenv = require("dotenv").config()

const addTask = asyncHandler(async (req,res) => {
    const {title, description} = req.body
    const user = req.user.id
    console.log(user)

    if(!title) {
        res.status(400)
        // res.send({message: "Uzupełnij tytuł"})
        throw new Error("Uzupełnij tytuł")
    } else if(!user) {
        res.status(400)
        // res.send({message: "Brak zalogowanego użytkownika"})
        throw new Error("Brak zalogowanego użytkownika")
    }

    const task = await Task.create({
        title,
        description,
        user
    })

    console.log(`task created ${task}`)


    if(task) {
        res.status(200),
        res.json({_id: task.id, title: task.title, description: task.description, user: task.user})
    }else {
        res.status(400)
        // res.send({message: "Task data is not valid"})
        throw new Error("User data is not valid")
    }
})

const showTasks = asyncHandler(async (req,res) => {

    const user = req.user.id


    if(!user) {
        res.status(400)
        res.send({message: "Brak zalogowanego użytkownika"})
        throw new Error("Brak zalogowanego użytkownika")
    } else {
        const tasks = await Task.find({user: user})
        res.json(tasks)
    }
})

const completeTask = asyncHandler(async (req,res) => {

    const user = req.user.id

    console.log(user)
    const task = await Task.findById(req.params.id)

    // console.log(task.user)

    if(!task){
        res.status(401)
        throw new Error("Brak taska")
    } else if(task.user.toString() !== user.toString()) {
        res.status(401)
        throw new Error("Brak uprawnień do usunięcia tego zadania")    
    } else {
        task.completed = !task.completed
        task.save()
        res.json({title: task.title, description: task.description, completed: task.completed})
    }
})

const editTask = asyncHandler(async (req,res) => {

    const user = req.user.id
    
    const task = await Task.findById(req.params.id)

    const {title, description} = req.body

    console.log(title)
    console.log(description)

    if(task.user.toString() !== user.toString()){
        res.status(401)
        throw new Error("Brak uprawnień do usunięcia tego zadania")
    } else {
        if(!title) {
            res.status(400)
            // res.send({message: "All fields are mandatory"})
            throw new Error("Uzupełnij tytuł")
        }
        await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
            },
            { new: true })
        res.json({_id: task.id, title: task.title, description: task.description})
    }
})

const deleteTask = asyncHandler(async (req,res) => {

    const user = req.user.id

    console.log(`tokenowy user_id ${user}`)
    const task = await Task.findById(req.params.id)

    console.log(`user_id z bazy ${task.user}`)

        if(task.user.toString() !== user.toString()){
            res.status(401)
            throw new Error("Brak uprawnień do usunięcia tego zadania")
            // res.send()
        } else {
            if(task) {
                await Task.findByIdAndDelete(req.params.id)
                res.status(204)
                console.log(`task deleted ${task}`)
            }else {
                res.status(404)
                // res.send({message: "Task data is not valid"})
                throw new Error("Brak zadania")
            }
            res.json(task)
        }
})

module.exports = {addTask, showTasks, completeTask, editTask, deleteTask}