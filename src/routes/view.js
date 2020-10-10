const express = require('express');

const router = express.Router();

router.get('/signup', (req, res) => {
    err = req.flash('error');
    res.render('sign-up', {err});
});

router.get('/signin', (req, res) => {
    err = req.flash('error');
    res.render('sign-in', {err});
});


router.get('/user/me', (req, res) => {
    res.render('user-info');
});

// app.get('/userInfo', connect.ensureLoggedIn('/login'),   (req, res) => {
//     console.log(req.user);
//     res.render('userInfo', {user: req.user});
// })

router.get('/secret', (req, res) => {
    res.render('secret');
});


module.exports = router;
