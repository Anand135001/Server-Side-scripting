const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const userModel = require("./models/user");
const postModel = require('./models/post');

const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
   res.render('index');
}); 


app.post('/create', async(req, res) => {
  let {username, name, age, email, password} = req.body;
  let user = await userModel.findOne({email});
  
  if(user) return res.send("User Already registered");
  
  const saltRounds = 10;
  const PlaintextPassword = '#@and!*#';

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(PlaintextPassword, salt, async(err, hash) => {
         
      let user = await userModel.create({
          username,
          name,
          age,
          email,
          password: hash
        });

      let token = jwt.sign({email, userid: user._id}, 'scretekey');
      res.cookie('token', token);
      res.send("User created");

    });
  });
});

app.listen(3000);