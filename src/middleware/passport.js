const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    email = user.email;
    if (user.provider === 'google') {
        email = user.emails[0].value
    }
    done(null, email);
});
  
passport.deserializeUser((email, done) => {
    User.findByEmail(email, (err, user) => {
        if (err) {
            return done(null, null, {message: err})
        }
        else {
            return done(null, user)
        }
    })
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.create({type: 'local', email: email, password: password }, (err, user) => {
        if (err) {
            return done(null, null, {message: err})
        }
        else {
            return done(null, user)
        }
    });
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.signIn({type: 'local', email: email, password: password }, (err, user) => {
        if (err) {
            return done(null, null, {message: err})
        }
        else {
            return done(null, user)
        }
    });
}));

// uses the desktop client ouath client id and secret 
passport.use('google-signup', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/signup/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.create({ type: 'google', email: profile.emails[0].value, googleId: profile.id }, (err, user) => {        
        if (err) {
            return done(null, null, {message: err})
        }
        else {
            return done(null, user)
        }
    });
}));

passport.use('google-signin', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/signin/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.signIn({ type: 'google', email: profile.emails[0].value, googleId: profile.id }, (err, user) => {
        if (err) {
            return done(null, null, {message: err});
        }
        else {
            return done(null, user);
        }
    });
}));

module.exports = passport