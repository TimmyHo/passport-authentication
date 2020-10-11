const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('welcome', {signedIn: req.isAuthenticated()});
})

router.get('/signup', (req, res) => {
    err = req.flash('error');
    res.render('sign-up', {signedIn: req.isAuthenticated(), err});
});

router.get('/signin', (req, res) => {
    err = req.flash('error');
    res.render('sign-in', {signedIn: req.isAuthenticated(), err});
});

router.get('/user/me', authMiddleware.isSignedIn, (req, res) => {
    res.render('user-info', {signedIn: req.isAuthenticated(), user: req.user});
});

router.get('/secret', authMiddleware.isSignedIn, (req, res) => {
    res.render('secret',{signedIn: req.isAuthenticated()    });
});

module.exports = router;
