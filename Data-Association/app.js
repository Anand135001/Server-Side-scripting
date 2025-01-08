const express = require('express')
const app = express()
const userModel = require('./model/user');
const postModel = require('./model/post');
const user = require('./model/user');

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/create', async (req, res) => {
    let user = await userModel.create({
        name: 'John',
        email: 'John@gmail.com',
        age: 25
    })

    res.send(user);
})

app.get('/createpost', async (req, res) => {
    let post = await postModel.create({
      postdata: "This is a post",
      user: "677e2ef296a91b9a29c9f72f",
      date: Date.now(),
    });
    
    let user = await userModel.findOne({ _id: "677e2ef296a91b9a29c9f72f" });
    user.posts.push(post._id);
    user.save();

    res.send({post, user});
})

app.listen(3000); 