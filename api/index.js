require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")

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
        //Generate access token
        const accessToken = jwt.sign(
            {id: user.id , isAdmin : user.isAdmin},
            process.env.JWT_SECRET_KEY
            )
        res.status(200).json({
            username: user.username ,
            isAdmin : user.isAdmin,
            accessToken
        });
    }
    else{
        res.status(400).json('Username or password incorrect')
    }
})

//verifying jwt token
const verify  =(req,res,next)=>{
    const authHeader  =req.headers.authorization;
    if(authHeader){
        const token  =  authHeader.split(" ")[1];

        jwt.verify(token , process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err){
                return res.status(403).json('Token is not valid')
            } 

            req.user = user;
            next();
        })
    } else{
        res.status(401).json("You are not authenticated")
    }
}
    

//delete user route
app.delete("/api/users/:userId" ,verify , (req,res)=>{
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user has been deleted")
    } else{
        res.status(403).json("You are not allowed to delete this user")
    }
})

//server
app.listen(5000, function(req,res){
    console.log("Backend Server is running on port 5000");
})