const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

//if dont create user for server, if hacker hack, all databse in the same server will be gone.

const session = require('express-session')
const flash = require('connect-flash')
//create a new session file store
const Filestore = require('session-file-store')(session)

const csrf = require('csurf')
app.use(urlencoded())

// create an instance of express app
const app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));



// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

const landingRoutes = require('./routes/landing')

const productRoutes = require('./routes/products')

const userRoutes = require('./routes/users');
const { urlencoded } = require("express");

app.use('/', landingRoutes)

app.use('/products', productRoutes)

app.use('/users', userRoutes)

//set-up sessions
app.use(session({
  store: new Filestore(), //we want to use files to store sessions
  secret: 'keyboard cat', //used to generate session id
  resave: false, //do we automatically recreate  the session even if there is no change to it
  initialized: true //if a new browser connects do we create a new session
}))

app.use(flash()) //very IMPT: register flash after sessions

//setup a middleware to inject the session into the hbs files
app.use(function(req,res,next){
  //res.locals will contain all variables available to hbs files
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
})

app.use(csrf())

app.use(function(req,res,next){
  res.locals.csrfToken = req.csrfToken();
  next();
})

// enable forms
// app.use(
//   express.urlencoded({
//     extended: false
//   })
// );

// async function main() {
  
// }

// main();

app.listen(8001, () => {
  console.log("Server has started");
});