const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

// app.get('/', (req, res) => {
//   res.cookie("name", "anand");
//   res.send('main');
// })

// app.get('/read', (req, res) => {
//   console.log(req.cookies);
//   res.send('read');
// })

// ==== encryption ===
app.get('/', (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash("dnakjkj", salt, function (err, hash) {
      console.log(hash);
    });
  });
  res.send("dcrypt");
})

// ==== Decryption ====
app.get('/', (req, res) => {
  bcrypt.compare(
    "dnakjkj",
    "$2b$10$/Kd5YHJcBkVwBMfNRBeG/uis2jHuRkG9e7/HUZr5qEAN1bIX6.5gy",
    function (err, result) {
      console.log(result);
    }
  );
})

app.listen(3000);
