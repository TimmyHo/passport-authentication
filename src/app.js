const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash =  require('connect-flash');
const hbs = require('hbs');

const viewRoutes = require('./routes/view');
const authRoutes = require('./routes/auth');

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

app.use(session({
    secret: 'this is a super secret and secure secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('', viewRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log('Server is up on port '+port);
});