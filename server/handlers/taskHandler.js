const asyncHandler = require("express-async-handler")
const Task = require("../models/taskModel")
const dotenv = require("dotenv").config()

const addTask = asyncHandler(async (req,res) => {
    const {title, description} = req.body

    if(!title) {
        res.status(400)
        // res.send({message: "All fields are mandatory"})
        throw new Error("Uzupełnij tytuł")
    }

    const task = await Task.create({
        title,
        description
    })

    console.log(`task created ${task}`)


    if(task) {
        res.status(200),
        res.json({_id: task.id, title: task.title, description: task.description})
    }else {
        res.status(400)
        // res.send({message: "Task data is not valid"})
        throw new Error("User data is not valid")
    }
})

const showTasks = asyncHandler(async (req,res) => {

    const tasks = await Task.find()
    res.json(tasks)
})

const completeTask = asyncHandler(async (req,res) => {

    
    // const tasks = await Task.findById(req.params.id)
    // res.json(tasks)
    // console.log(tasks)


    const task = await Task.findById(req.params.id)

    task.completed = !task.completed

    task.save()

    res.json({title: task.title, description: task.description, completed: task.completed})


    // const task = await Task.findByIdAndUpdate(
    //     req.params.id, 
    //     {completed: !completed},{ new: true })
    // res.json({title: task.title, description: task.description, completed: task.completed})

    // console.log(req.params)
    // const {title, description, completed} = req.body


    // if(!title) {
    //     res.status(400)
    //     // res.send({message: "All fields are mandatory"})
    //     throw new Error("Uzupełnij tytuł")
    // }

    // const task = await Task.findByIdAndUpdate(
    //     req.params.id,
    //     {
    //         title,
    //         description,
    //         completed
    //     },
    //     { new: true })
    // res.json({_id: task.id, title: task.title, description: task.description, completed: task.completed})

})

const editTask = asyncHandler(async (req,res) => {
    console.log(req.params)
    const {title, description, completed} = req.body

    console.log(title)
    console.log(description)
    console.log(completed)

    if(!title) {
        res.status(400)
        // res.send({message: "All fields are mandatory"})
        throw new Error("Uzupełnij tytuł")
    }

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
            title,
            description,
            completed
        },
        { new: true })
    res.json({_id: task.id, title: task.title, description: task.description, completed: task.completed})

})

const deleteTask = asyncHandler(async (req,res) => {

    const {id} = req.params
    const task = await Task.findByIdAndDelete(req.params.id)

    if(task) {
        res.status(204)
        console.log(`task deleted ${task}`)
    }else {
        res.status(404)
        // res.send({message: "Task data is not valid"})
        throw new Error("Brak zadania")
    }
    res.json(task)
})

module.exports = {addTask, showTasks, completeTask, editTask, deleteTask}