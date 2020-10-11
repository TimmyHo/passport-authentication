const express = require('express');
const passport = require('../middleware/passport');

const router = express.Router();

// LOCAL AUTH
router.post('/signup/local', passport.authenticate('local-signup', {
    successRedirect: '/user/me',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/signin/local', passport.authenticate('local-signin', {
    successRedirect: '/user/me',
    failureRedirect: '/signin',
    failureFlash: true
}));

// GOOGLE AUTHs
router.post('/signup/google', passport.authenticate('google-signup', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
}));

router.post('/signin/google', passport.authenticate('google-signin', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/signup/google/callback', passport.authenticate('google-signup', {
    successRedirect: '/user/me',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin/google/callback', passport.authenticate('google-signin', {
    successRedirect: '/user/me',
    failureRedirect: '/signin',
    failureFlash: true
}));

// GENERAL SIGNOUT
router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
