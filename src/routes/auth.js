const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('../db/mongoose');
const User = require('../models/user');

const router = express.Router();

passport.serializeUser((user, done) => {
    console.log('serializing user')
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    console.log('deserializing user')
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('signup-local', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, (email, password, done) => {
        console.log(`SIGN UP -> Trying to authenticate: ${email}, ${password} `);
                  
        // User.findByUsername(username, (err, user) => {
        // if (err) { return done(err); }
        // if (!user) {
        //     return done(null, false, { message: 'Incorrect username.' });
        // }
        // if (user.password !== password) {
        //     return done(null, false, { message: 'Incorrect password.' });
        // }
        // return done(null, user);
        // });
        // User.findOrCreate({ email: email, type: 'local', password: password }, (err, user) => {
        //     return done(err, user);
        // });

        // User.findOrCreate({ email: email, type: 'local', password: password }, (err, user) => {
        //     return done(err, user);
        // });
        return done('this is an error')
    }
));

passport.use('signin-local', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
}, (email, password, done) => {
    console.log(`SIGN in -> Trying to authenticate: ${email}, ${password} `);
    return done(null, 'awesome')
}
));

router.post('/signup/local', passport.authenticate('signin-local', {successRedirect: '/user/me', failureRedirect: '/signUp'}));
// });


// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// // Use the GoogleStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and Google
// //   profile), and invoke a callback with a user object.

// // uses the desktop client ouath client id and secret 
// // passport.use(new GoogleStrategy({
// //     clientID: process.env.GOOGLE_CLIENT_ID,
// //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //     callbackURL: "/auth/google/callback"
// //   },
// //   function(accessToken, refreshToken, profile, done) {
// //     console.log('this is working');
// //     console.log(accessToken);
// //     console.log(refreshToken);
// //     console.log(profile)

// //        User.findOrCreate({ email: profile.emails[0].value, type: 'google', googleId: profile.id }, function (err, user) {
// //          return done(err, user);
// //        });
// //     done(null, profile);
// //   }
// // ));

// app.post('/login', passport.authenticate('local', { successRedirect: '/userInfo', failureRedirect: '/login' }));





// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid'] }));

// // GET /auth/google/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// // app.get('/auth/google/callback', 
// //   passport.authenticate('google', { failureRedirect: '/login' }),
// //   function(req, res) {
// //     res.redirect('/');
// //   });

// app.get('/auth/google/callback', passport.authenticate("google"), (req, res) => {
//     console.log(req.user);
//     res.send(req.user);
// });


module.exports = router;