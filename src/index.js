const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user.router");
const taskRouter =  require("./routers/task.router");
const app = express();
const port = process.env.PORT || 3000;

/* app.use( (req, res,next) => {
    res.status(503).send("Site is in maintenanace mode");
}); */

/* app.use( (req, res,next) => {
    if(req.method === "GET") {
        res.send("GET Requests are disabled");
    } else {
        next();
    }
}); */

/* const multer = require("multer");
const upload = multer({
    dest: "images"
})

app.post("/upload", upload.single("upload"), (req,res) => {
    res.status(200).send("");
}); */


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

/* const jwt = require("jsonwebtoken");

const myJwtFunction = async () => {
    const token= jwt.sign({_id: "abc123"},"thisismycourse",{expiresIn: "120 seconds"});
    console.log(token);
    const data = jwt.verify(token, "thisismycourse");
    console.log(data);
};

myJwtFunction(); */

/* const bcryptjs = require("bcryptjs");
const myFunction = async () => {
    const password= "Red12345!";
    const hashedPassword = await bcryptjs.hash(password,8);
    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcryptjs.compare(password,hashedPassword);
    console.log(isMatch);
};

myFunction(); */



app.listen(port, () => {
    console.log("Server is running at "+ port); 
});

/* const Task = require("./models/task");
const User = require("./models/user");

const main = async() =>{
    const task = await Task.findById("5d836484ccc12a17940135eb");
    await task.populate("owner").execPopulate();
    console.log(task.owner);


    const user = await User.findById("5d83630e438e8622708a5bd8");
    await user.populate("tasks").execPopulate();
    console.log(user.tasks); 
};

main(); */