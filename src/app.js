const path = require('path');
const express = require('express');
const hbs = require('hbs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const connect = require('connect-ensure-login');

const viewRoutes = require('./routes/view');
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

app.use('', viewRoutes);

app.use(session(
    {
        secret: 'nyan cat',
        resave: false,
        saveUninitialized: false
    }
));

app.use(passport.initialize());
app.use(passport.session());

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

passport.use(new LocalStrategy(
    (email, password, done) => {
        console.log(`trying to authenticate: ${email}, ${password} `);
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
        User.findOrCreate({ email: email, type: 'local', password: password }, function (err, user) {
                     return done(err, user);
                   });
    }
));

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

// uses the desktop client ouath client id and secret 
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log('this is working');
//     console.log(accessToken);
//     console.log(refreshToken);
//     console.log(profile)

//        User.findOrCreate({ email: profile.emails[0].value, type: 'google', googleId: profile.id }, function (err, user) {
//          return done(err, user);
//        });
//     done(null, profile);
//   }
// ));

app.get('/', (req, res) => {
    res.send({
        title: 'Passport Authentication Test'
    });
});

// app.post('/login', passport.authenticate('local', { successRedirect: '/userInfo', failureRedirect: '/login' }));

// this only renders on a post to login which should actually redirect to userinfo
app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.redirect('/userInfo')
});



app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.get('/auth/google/callback', passport.authenticate("google"), (req, res) => {
    console.log(req.user);
    res.send(req.user);
});


app.listen(port,  () => {
    console.log('Server is up on port '+port);
});