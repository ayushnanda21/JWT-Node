require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")

const app = express();
app.use(express.json())

//server memory
const users = [
    {
        id : "1",
        username: "john",
        password: "John0908",
        isAdmin : true,
    },
    {
        id : "2",
        username: "jane",
        password: "Jane0908",
        isAdmin : false,
    }
];


app.post("/api/login", (req,res)=>{
    const {username, password} = req.body
    const user = users.find(u=>{
        return u.username === username && u.password === password
    });

    if(user){
        res.status(200).json(user);
    }
    else{
        res.status(400).json('Username or password incorrect')
    }
})
    

//server
app.listen(5000, function(req,res){
    console.log("Backend Server is running on port 5000");
})