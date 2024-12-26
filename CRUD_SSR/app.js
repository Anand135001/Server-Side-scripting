const path = require('path');
const express =  require('express');
const app = express();
const userModel = require('./models/user')

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")))


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/read", async(req, res) => {
  let allusers = await userModel.find();  
  res.render("read", {users: allusers});
});

app.post("/create", async (req, res) => {
  let {name, email, image} = req.body;
  let createUser = await userModel.create({
    name, 
    email,
    image    
  })
  res.redirect("/read");
});

app.get("/delete/:id", async (req, res) => {
  let users = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => {
  let {name, email, image} = req.body;

  let user = await userModel.findOneAndUpdate(
    { _id: req.params.userid }, 
    {name, email, image}, 
    {new: true}
  );
  res.redirect("/read");
});

app.listen(3000);




