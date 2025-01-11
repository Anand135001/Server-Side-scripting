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
  
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async(err, hash) => {
         
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

app.get('/login', (req, res) => {
   res.render('login');
})

app.post('/login', async(req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({email});
  if (!user) return res.send("Somthing went wrong");
  bcrypt.compare(password, user.password, (err, result) => {
      if(result) {
        let token = jwt.sign({email, userid: user._id},'scretekey');
        res.cookie('token', token);
        res.status(200).send("login successful");
      }
      else res.redirect('/login');
  });

})

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("logged out");
});


app.get('/profile', isloggedIn, async(req, res) => {
  console.log(req.user);     
  res.send("login");
});


function isloggedIn(req, res, next){
 try{
  
    let token = req.cookies.token;
    if(!token){
      res.send("You are not logged in");
    }
    else{
      let data = jwt.verify(token, 'scretekey'); 
      req.user = data;
      next();
    }
  }catch(err){
     res.send("Login required");
  } 
}
app.listen(3000);