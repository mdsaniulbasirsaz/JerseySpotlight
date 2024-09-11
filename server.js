const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
require('dotenv').config();
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI, {
    
  })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB connection error:', err));

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
app.use(express.static('src'));

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





//Define USer Schema
const userSchema = new mongoose.Schema({
  username : String,
  name : String,
  email : String,
  phone : String,
  password : String
});
const User = mongoose.model('User', userSchema);
module.exports = User;

app.post('/users', async (req, res) => {
  try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
  } catch (error) {
      res.status(400).send(error);
  }
});
app.get('/users/:username', async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



//Login

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//Productbooking
const productSchema = new mongoose.Schema({
  username: String,
  productName : String,
  price : String,
  image : String
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;

app.post('/addcart', async(req,res) =>{
  try{
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  }
  catch(error){
    res.status(400).send(error);
  }
});

app.get('/cartDetails/:username', async(req,res) =>{
  try{
  const username = req.params.username;
  const product = await Product.findOne({username:username});
  if(!product)
  {
    return res.status(404).json({message: 'Cart Details cannot found'});
  }
  res.status(200).json(product);
}
catch(error){
  res.status(500).json({message: 'Server error'});
  }
});

//Add Product
const addProductSchema = new mongoose.Schema({
  productName : String,
  image: String,
  price: String
});
const AddProduct = mongoose.model('AddProduct', addProductSchema);
module.exports = AddProduct;

app.post('/addProduct',async(req,res) =>{
  try{
    const addProduct = new AddProduct(req.body);
    await addProduct.save();
    res.status(201).send(addProduct);
  }
  catch(error){
    res.status(400).send(error);
  }
});

app.get('/getProducts', async (req, res) => {
  try {
    const products = await AddProduct.find(); 
    res.status(200).send(products); 
  } catch (error) {
    res.status(400).send(error);
  }
});













  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });