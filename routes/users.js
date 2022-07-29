const express = require("express");
const router = express.Router();
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    //the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64')
    return hash
}

// import in the User model
const { User } = require('../models');

const { createUserForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/signup', (req,res)=>{
    // display the registration form
    const signUpForm = createUserForm();
    res.render('users/signup', {
        'form': signUpForm.toHTML(bootstrapField)
    })
})

router.post('/signup', (req,res)=>{
    const userForm = createUserForm();
    userForm.handle(req,{
        success: async (form) =>{
            const user = newUser
            user.set('username', form.data.userName),
            user.set('password', form.data.password),
            user.set('email', form.data.email)
            
            //user.set(userData);
        }
        
    })
})

router.get('/login', async function(req,res){
    const loginForm = createLoginForm()
  
    res.render('users/signup', {
        'form': loginUpForm.toHTML(bootstrapField)
    })
})

router.post('/login', async function(req,res){
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'success': async function(form){
            const user = await User.where({
                'email': form.data.email,
                'password': getHashedPassword(form.data.password)
            }).fetch({
                require: false
            });

            //check if the user does not exist
            if(!user) {
                req.flash('error_messages, "Invalid credentials')
                res.redirect('/users/login')
            } else {
                res.render('users/profile',{
                    'user': user
                })        
            }
        }
    })
})

module.exports = router;