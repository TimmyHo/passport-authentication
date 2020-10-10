const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('welcome');
})

router.get('/signup', (req, res) => {
    err = req.flash('error');
    res.render('sign-up', {err});
});

router.get('/signin', (req, res) => {
    err = req.flash('error');
    res.render('sign-in', {err});
});

router.get('/user/me', authMiddleware.isSignedIn,  (req, res) => {
    console.log('USER: '+req.user)
    res.render('user-info', {user: req.user});
});

// app.get('/userInfo', connect.ensureLoggedIn('/login'),   (req, res) => {
//     console.log(req.user);
//     res.render('userInfo', {user: req.user});
// })

router.get('/secret', authMiddleware.isSignedIn, (req, res) => {
    res.render('secret');
});


module.exports = router;
