const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const ssuser = require('./ssusermodel');
const app = express();

mongoose.connect('mongodb://localhost:27017/SkillSwapDB1',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB connection error:', err));

app.use(express.json())

app.get('/', (req, res) => {
    return res.send('hello, world')
});


app.post('/register', async(req,res) =>{
    try{
        const {fullname,email,mobile,skill,password,confirmpassword} = req.body;
        const exist = await ssuser.findOne({email});
        if(exist) {
            return res.status(400).send('User Already Registered')
        }
        if(passoword != confirmpassword ){
            return res.status(403).send('password not valid');
        }
        let newUser = new ssuser({
            fullname,email,mobile,skill,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('User Registered')
    }
    catch(err){
console.log(err);
return res.status(500).send('server error')
    }
})

app.post('/login',async (req, res) =>{
    try{
          const {email,password} = req.body;
          const exist = await ssuser.findOne({email});
          if(!exist){
            return res.status(400).send('user not exist')
          }
          if(exist.password != password){
            return res.status(400).send('password invalid')
          }
          let payload = {
            user: {
                id : exist.id
            }
          }
          jwt.sign(payload,'jwtPassword',{expiresIn: 36000000},
            (err,token) => {
                if (err) throw err
                return res.json({token})
            })

          
    }
    catch(err){
        console.log(err);
return res.status(500).send('server error')
    }
})
app.get('/allprofiles',async(req,res) =>{
    try
    {
        let allprofiles=await ssuser.find();
        return response.json(allprofiles);

    }
    catch(err){
        console.log(err);
return res.status(500).send('server error')
    }
})
app.listen(5000,()=> console.log('server running...'));