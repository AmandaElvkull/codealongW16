import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// install moongose, npm install --save bcrypt-nodejs

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/auth"
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise =  Promise

const User = mongoose.model('User', {
  name: {
    type: String, 
    unique: true, 
  },
  password:{
    type: String, 
    required: true, 
  },
  accessToken:{
    type: String, 
    //RandomBytes change number it will change the length of random bytes. Hex is easier to store in the database
    default: () => crypto.randomBytes(128).toString('hex')
  }
})

// Example
//POST reques 
//const request = {name: "Bob", password: "foodbar"};

//DB entry 

//const dbEntry = { name: "Bob", password:"5abbbbc343242342cc"}

// compare the passwords 
//bcrypt.compareSync(request.password, dbEntry.password)

// One-way encryption 
//const user = new User({name: 'Bob', password:bcrypt.hashSync("foodbar")})
//user.save()

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post('/sessions', async(req,res) => {
  const user= await User.findOne({name: req.body.name})
  if (user && bcrypt.compareSync(rew.body.password, user.password)){
    // success
    res.json({userId: user._id, accessToken})
  }else {
    // Failure
    // a. user does not exist
    //b. Encrypted password does not match 
    res.json({notFound: true})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
