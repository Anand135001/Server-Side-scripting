const express = require("express");
const app = express();

const userModel = require('./userModel');



app.get("/", (req, res) => {
  res.send("helo");
});

app.get("/create", async(req, res) => {
// asynchronouse code  
   let createUser = await userModel.create({
     name: "Anand",
     email: "anand@gmail.com",
     username: "ani02"
   })
   res.send(createUser);
})

app.get('/update', async(req, res) => {
    
    let updatedUser =  await userModel.findOneAndUpdate(
        {username: "ani02"},
        {name:"Anand mainwal"},    
        {new: true}
    )
    res.send(updatedUser);
})

app.get('/read', async(req, res) => {
  let users = await userModel.find();
  res.send(users);
})



app.listen(3000);