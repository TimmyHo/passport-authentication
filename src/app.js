const path = require('path');
const express = require('express');
const hbs = require('hbs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const connect = require('connect-ensure-login');

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
        (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/userInfo', failureRedirect: '/login' }));

// this only renders on a post to login which should actually redirect to userinfo
app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user);
    res.render('userInfo', {user: req.user})
});

app.get('/userInfo', connect.ensureLoggedIn('/login'),   (req, res) => {
    console.log(req.user);
    res.render('userInfo', {user: req.user});
})

app.listen(port,  () => {
    console.log('Server is up on port '+port);
});