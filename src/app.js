const path = require('path');
const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
const flash =  require('connect-flash');

const connect = require('connect-ensure-login');

const viewRoutes = require('./routes/view');
// const authRoutes = require('./routes/auth');


const LocalStrategy = require('passport-local').Strategy;

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

app.get('/', (req, res) => {
    res.send({
        title: 'Passport Authentication Test'
    });
});
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

// passport.use('signup-local', new LocalStrategy({
//         usernameField : 'email',
//         passwordField : 'password',
//     }, (email, password, done) => {
//         console.log(`SIGN UP -> Trying to authenticate: ${email}, ${password} `);
                  
//         // User.findByUsername(username, (err, user) => {
//         // if (err) { return done(err); }
//         // if (!user) {
//         //     return done(null, false, { message: 'Incorrect username.' });
//         // }
//         // if (user.password !== password) {
//         //     return done(null, false, { message: 'Incorrect password.' });
//         // }
//         // return done(null, user);
//         // });
//         // User.findOrCreate({ email: email, type: 'local', password: password }, (err, user) => {
//         //     return done(err, user);
//         // });

//         // User.findOrCreate({ email: email, type: 'local', password: password }, (err, user) => {
//         //     return done(err, user);
//         // });
//         return done('this is an error')
//     }
// ));

// passport.use(new LocalStrategy( function (email, password, done) {
//     console.log(`FREE -> Trying to authenticate: ${email}, ${password} `);
//         return done(null, {id: 'awesome'})
// }
// ));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    User.create({type: 'local', email: email, password: password }, (err, user) => {
        // console.log('wow!')
        if (err) {
            return done(null, null, {message: err})
        }
        else {
            return done(null, user)
        }
    });
}
));

app.post('/auth/signup/local', passport.authenticate('local-signup', {
    successRedirect: '/user/me',
    failureRedirect: '/signup',
    failureFlash: true
    // res.send('hi');
}));

// app.get('/auth/signup/local', passport.authenticate('local-signin', {successRedirect: '/user/me', failureRedirect: '/signUp'}));


app.listen(port,  () => {
    console.log('Server is up on port '+port);
});