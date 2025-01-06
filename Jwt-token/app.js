const userModel = require('./models/user')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const express = require('express');
const app = express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())



app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
  let {username, email, password, age} = req.body;
  
  bcrypt.genSalt(10, (err, salt) => {
     bcrypt.hash(password, salt, async(err, hash) => {
      
      let createdUser = await userModel.create({
          username,
          email,
          password: hash,
          age
      }) 
        
      let cookietoken = jwt.sign({email}, "secretKey");
      res.cookie("token", cookietoken)
      res.send(createdUser);
     
    })
  });

});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async(req, res) => {
  let user = await userModel.findOne({email: req.body.email});
  if(!user) return res.send("Not found");
  
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if(result){
      let cookietoken = jwt.sign({email: user.email}, "secretKey");
      res.cookie("token", cookietoken);
      res.send("login successful");
    }
    else{
      res.send("login failed");
    }
  });
});


app.get('/logout', (req, res) => {
   res.cookie("token", "");
   res.redirect('/');
});

app.listen(3000);