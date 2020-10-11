const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash =  require('connect-flash');
const hbs = require('hbs');

const viewRoutes = require('./routes/view');
// const authRoutes = require('./routes/auth');

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const mongoose = require('./db/mongoose');
const User = require('./models/user');
const app = express();

const port = process.env.PORT || 5000;

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies


app.use(session(
    {
        secret: 'nyan cat',
        resave: false,
        saveUninitialized: false
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('', viewRoutes);
// app.use('/auth', authRoutes);

passport.serializeUser((user, done) => {
    email = user.email;
    if (user.provider === 'google') {
        email = user.emails[0].value
    }
    console.log(`serializing user by email: ${email}`);
    done(null, email);
});
  
passport.deserializeUser((email, done) => {
    console.log(`deserializing user by email: ${email}`);
    User.findByEmail(email,  (err, user) => {
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
        console.log(user)
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
    done(null, profile);
}));

app.post('/auth/signup/local', passport.authenticate('local-signup', {
    successRedirect: '/user/me',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.post('/auth/signin/local', passport.authenticate('local-signin', {
    successRedirect: '/user/me',
    failureRedirect: '/signin',
    failureFlash: true
}));


app.post('/auth/signup/google', passport.authenticate('google-signup', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
}));

app.post('/auth/signin/google', passport.authenticate('google-signin', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
}));

app.get('/auth/signup/google/callback', passport.authenticate('google-signup', {
    successRedirect: '/user/me',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get('/auth/signin/google/callback', passport.authenticate('google-signin', {
    successRedirect: '/user/me',
    failureRedirect: '/signin',
    failureFlash: true
}));


app.get('/auth/signout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(port, () => {
    console.log('Server is up on port '+port);
});