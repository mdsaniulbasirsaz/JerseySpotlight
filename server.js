const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB connected!'))
//   .catch(err => console.log('MongoDB connection error:', err));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });


app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('styles'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/cart', (req, res) => {
  res.sendFile(__dirname + '/public/cart.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
  });
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });