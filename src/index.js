const path = require('path');

const express = require('express')
const exphbs  = require('express-handlebars');

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views');
const partialsPath = path.join(__dirname, '../views/partials');
const publicPath = path.join(__dirname, '../public');

const app = express()
require('./db/mongoose.js')
require("dotenv").config()

app.engine( 'handlebars', exphbs( { 
  extname: 'handlebars', 
  //defaultLayout: 'main', 
//layoutsDir: __dirname + '/views/layouts/',
  partialsDir: partialsPath
} ) );  

app.set( 'view engine', 'handlebars' );
//app.use(express.static(publicDirectoryPath))
const userRouter = require('./routers/user')
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
app.use(express.static(publicDirectoryPath))
app.use(express.json()) 
app.use(userRouter)
