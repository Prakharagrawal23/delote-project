const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require ('./models/FormData');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));

mongoose.connect('mongodb://127.0.0.1:27017/practice_mern');

app.post('/register', async (req, res)=>{
    // To post / insert data into database
    
    // const {email, password} = req.body;
    // FormDataModel.findOne({email: email})
    // .then(user => {
    //     if(user){
    //         res.json("Already registered")
    //     }
    //     else{
    //         FormDataModel.create(req.body)
    //         .then(log_reg_form => res.json(log_reg_form))
    //         .catch(err => res.json(err))
    //     }
    // })
    



    try {
        const { email, password } = req.body;
      
        // Check if user already exists
        const existingUser = await FormDataModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already registered' });
        }
      
        // Hash the password before storing it
        const saltRounds = 10; // You can adjust this value for more security, but it will take longer to hash
        const hashedPassword = await bcrypt.hash(password, saltRounds);
      
        // Create new user with hashed password
        const newUser = await FormDataModel.create({
          ...req.body,
          password: hashedPassword
        });
      
        res.json(newUser);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
      }
    });
    

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await FormDataModel.findOne({ email });

    if (user) {
      // Compare the hashed password with the plaintext password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.json("Success");
      } else {
        res.status(400).json("Wrong password");
      }
    } else {
      res.status(404).json("No records found!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});



