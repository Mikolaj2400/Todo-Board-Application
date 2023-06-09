const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/todo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected"))
.catch((err) => console.log(err))


const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/user", require("./routes/userRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})