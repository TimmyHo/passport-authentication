const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const User = require('./models/user');

const app = express();


const port = process.env.PORT || 5000;

app.use(express.static('public'));

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

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log(`trying to authenticate: ${username}, ${password} `);
        User.findByUsername(username, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
        });
    }
));

app.get('/', (req, res) => {
    res.send({
        title: 'Passport Authentication Test'
    });
});

app.get('/login', 
        passport.authenticate('local'),
        (req, res) => {
    res.send({
        title: 'Login page'
    });
});

app.post('/login', passport.authenticate('local')
// , (err, user, msg) => {
//     console.log(err, user, msg);
// })
, (req, res) => {
    console.log(req.user);
    res.send({
        title: 'login ok!'
    })
});

app.listen(port,  () => {
    console.log('Server is up on port '+port);
});