const express = require('express');
const router = express();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//login page
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

router.use(express.urlencoded({ extended: false }));

//Register Handle
router.post('/register', function (req, res) {
    const { name, email, password, password2 } = req.body;

    let errors = [];

    // check require fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //check password
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check password length

    if (password.length < 6) {
        errors.push({ msg: 'Passwords should be at least 6 characters' });
    }

    if (errors.length > 0) {

        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });

    }
    else {
        // validation password
        User.findOne({ email: email })
            .then(user => {
                // User Exists
                if (user) {
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // set password to hashed
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are registered');
                                    res.redirect('/users/login');
                                }).catch((err) => {
                                    console.log(err);
                                });
                        }
                        ));
                }
            });
    }
});

//Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;
