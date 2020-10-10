const express = require('express');
const router = express.Router();

router.get('/signUp', (req, res) => {
    res.render('sign-up');
});

router.get('/signIn', (req, res) => {
    res.render('sign-in');
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
