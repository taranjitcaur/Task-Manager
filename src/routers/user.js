const { response } = require('express');
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const bodyparser = require('body-parser')
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}))

router.get('/', function (req, res) {
    res.render('login', {layout: false});
})

router.get('/login', function (req, res) {
    res.render('login', {layout: false});
})
router.get('/register', function (req, res) {
    res.render('register', {layout: false});
})
router.post('/users', async(req, res) => {
    const user = new User(req.body)      
    try {
        await user.save()
        const token = user.generateAuthToken()   
        console.log(token)  
        res.send(user)
    } catch(error) {
        return res.status(400).send(error)
    }    
})
router.post('/login', async function(req, res) { 
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.clearCookie('Authorization');
        const token = await user.generateAuthToken()           
        console.log('imuser')        
        res.cookie('Authorization',token)
        //res.render('login', {layout: 'main', errorMessage: 'User Found' })  
        res.render('welcome', {layout: 'main', successMessage: 'Welcome onboard !' })            
    } catch (e) {        
        console.log(e.message)
        //res.status(400).send(e.message)   //catch errors e.name, e.message
        res.render('error', {
            layout: 'main',
            Message: e.message
        })
    }
})    
router.post('/register', async (req, res) => {   
    try {
        var user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken()
        //res.status(200).send(user);
        res.render('login', {layout: 'main', Message: 'Registration successful ! Please login.' })  
      } catch (error) {
        if (error.name === "ValidationError") {
          let errors = {};    
          Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
          });             
          return res.status(400).send(errors);
        }
        res.status(500).send("Something went wrong");
      }
})  
router.get('/welcome', auth, function(req, res){
    res.render('welcome', {layout: 'main', successMessage: 'Welcome onboard !' })  
})
router.get('/tasks', auth, function(req,res) {
    console.log(req.body)
    console.log('imintasks router')
    res.render('tasks')
})
router.get('/logout', auth, async function(req, res){
    //console.log(req.user.tokens)

   // console.log('req.user.tokens')
   try {
    req.user.tokens = req.user.tokens.forEach((key) => {   
        return req.token !== key.token
    })    
    await req.user.save()   
    res.render('login', {layout: 'main', Message: 'Please login again !' })   
   } catch(err) {
    res.render('error', {
        layout: 'main',
        Message: err.message
    })
   }
     
})
router.get('*', (req, res) => {
    res.render('404', {layout: false})    
})
module.exports = router