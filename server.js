const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const ejs = require('ejs');
const engine = require('ejs-mate');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const _ = require('underscore');
const moment = require('moment');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const Enlevement = require('./models/enlevement');

const app = express();

mongoose.connect('mongodb+srv://David:2020pressingservice@cluster0.jap04.mongodb.net/Pressing_Service?retryWrites=true&w=majority', { useNewUrlParser: true,  useUnifiedTopology: true});

require('./config/passport')(passport);

require('./secret/secret');


app.use(express.static('public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(validator());

app.use(session({
    secret: 'thisismytestkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/fonctionnement', (req, res) => {
    res.render('fonctionnement');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/application', (req, res) => {
    res.render('application/accueil');
});

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.locals._ = _;
app.locals.moment = moment;


app.post('/Enlevement', (req, res) => {
   
    const enlevement = new Enlevement();
    enlevement.date  = req.body.date;
    enlevement.heure = req.body.heure;
    enlevement.lieu = req.body.lieu;
    enlevement.tel = req.body.tel;
    enlevement.comments = req.body.comments;
    enlevement.save((err) => {
        if(err) {
            console.log(err);
        }

        console.log(enlevement);

        req.flash('success', 'Company data has been added.');
        res.redirect('/');
    })
});


require('./routes/user')(app, passport);

app.listen(3000, () => {
    console.log('App running on port 3000');
});


