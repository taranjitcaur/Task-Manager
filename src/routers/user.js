const { response } = require('express');
const express = require('express')
const router = new express.Router()
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
    /*try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user)
        //const token = await user.generateAuthToken()
        res.render('welcome', {layout: false});
    } catch(error) {
            console.log(error)
            res.status(400).send(error)    
    }*/
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
        console.log('user found')
    } catch (e) {        
        //res.status(400).send(e.message)   //catch errors e.name, e.message
        res.render('error', {
            layout: 'main',
            errorMessage: e.message
        })
    }
})    
router.post('/register', async (req, res) => {   
    try {
        var user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken()
        res.status(200).send(user);
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
router.get('*', (req, res) => {
    res.render('404', {layout: false})
})
module.exports = router