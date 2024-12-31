const express = require('express');
const app = express();
<<<<<<< HEAD
// const bcrypt = require('bcrypt');
=======
const bcrypt = require('bcrypt');
>>>>>>> d35a601fa874088ca05481b30d1afebca9e8a901
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
app.use(cookieParser());
<<<<<<< HEAD

// ***************************************
=======
>>>>>>> d35a601fa874088ca05481b30d1afebca9e8a901

// app.get('/', (req, res) => {
//   res.cookie("name", "anand");
//   res.send('main');
// })

// app.get('/read', (req, res) => {
//   console.log(req.cookies);
//   res.send('read');
// })

// ************************************** 
// ==== encryption ===
// app.get('/', (req, res) => {
//   bcrypt.genSalt(10, function (err, salt) {
//     bcrypt.hash("dnakjkj", salt, function (err, hash) {
//       console.log(hash);
//     });
//   });
//   res.send("dcrypt");
// })

// // ==== Decryption ====
// app.get('/', (req, res) => {
//   bcrypt.compare(
//     "dnakjkj",
//     "$2b$10$/Kd5YHJcBkVwBMfNRBeG/uis2jHuRkG9e7/HUZr5qEAN1bIX6.5gy",
//     function (err, result) {
//       console.log(result);
//     }
//   );
// })

// **********************************

app.get('/', (req, res) => {
  let Incrypt_token = jwt.sign({email: "anand@gmail.com"}, 'hide')
  res.cookie("token", token);
  res.send('hello');
})

app.get('/token', (req, res) => {
  console.log(req.cookies.token);
  let decrypt_token = jwt.verify(req.cookies.token, "hide");
  console.log(decrypt_token);
})

// =========== Jwt token ============
app.get('/', (req, res) => {
  let Incrypt_token = jwt.sign({email: "anand@gmail.com"}, 'hide')
  res.cookie("token", token);
  res.send('hello');
})

app.get('/token', (req, res) => {
  console.log(req.cookies.token);
  let decrypt_token = jwt.verify(req.cookies.token, "hide");
  console.log(decrypt_token);
})

app.listen(3000);
