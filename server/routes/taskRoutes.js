const express = require("express")
const { addTask, showTasks, completeTask, editTask, deleteTask } = require("../handlers/taskHandler")
const router = express.Router()

router.post("/add", addTask)

router.get("/", showTasks)

router.put("/complete/:id", completeTask)

router.put("/edit/:id", editTask)

router.delete("/delete/:id", deleteTask)

module.exports = router