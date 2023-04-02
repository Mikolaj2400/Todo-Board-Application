const express = require("express")
const { addTask, showTasks, completeTask, editTask, deleteTask } = require("../handlers/taskHandler")
const router = express.Router()
const validateToken = require("../middleware/validateToken");

router.post("/add", validateToken, addTask)

router.get("/", validateToken, showTasks)

router.put("/complete/:id", validateToken, completeTask)

router.put("/edit/:id", validateToken, editTask)

router.delete("/delete/:id", validateToken, deleteTask)

module.exports = router