const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const userModel = require("./models/user");
const postModel = require('./models/post');
const path = require('path');
const upload = require('./utils/multer');

const express = require('express');
const post = require('./models/post');
const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

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
});

app.post('/login', async(req, res) => {
  let { email, password } = req.body;
  
  let user = await userModel.findOne({email});
  if (!user) return res.send("Somthing went wrong");
  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
      let token = jwt.sign({email, userid: user._id},'scretekey');
      res.cookie('token', token);
      res.status(200).redirect("/profile");
    }
    else res.redirect('/login');
  });
  
});

app.post('/post', isloggedIn, async(req, res) => {
    let user = await userModel.findOne({email: req.user.email});

    let post = await postModel.create({
      user: user._id,
      content: req.body.content 
    });

    await user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');

});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get('/profile', isloggedIn, async(req, res) => {
  let user = await userModel.findOne({email: req.user.email}).populate('posts');
  res.render('profile', {user});
});

app.get("/like/:id", isloggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  if(post.likes.indexOf(req.user.userid) === -1 ){
    await post.likes.push(req.user.userid);
  }
  else{
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  
  await post.save();
  res.redirect("/profile");
});

app.get('/edit/:id', isloggedIn, async(req, res) => {  
  let post = await postModel.findOne({_id : req.params.id});

  res.render('edit', {post});
});

app.post('/update/:id', isloggedIn, async(req, res) => {
  await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect('/profile');
});

app.get('/profile/upload', (req, res) => {
   res.render('pfpupload');
});

app.post("/upload", isloggedIn, upload.single('image'), async(req, res) => {
  let user = await userModel.findOne({email: req.user.email});
  user.profile = req.file.filename;

  await user.save();
  res.redirect('/profile');
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