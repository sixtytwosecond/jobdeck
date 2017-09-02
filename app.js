// server.js
//http://52.36.32.4:8080/
// set up ======================================================================
// get all the tools we need
var express  = require('express');
//var settings=require("./lib/config/global_settings.js")
var app      = express();
var port     = process.env.PORT || 8080;
var http = require('http').Server(app);
var path = require('path');
app.use(express.static(path.join(__dirname,"views","public")));
app.set('views', path.join(__dirname,"views","public"));

app.get('bundle.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});
/*
var passport = require('passport');
var flash    = require('connect-flash');
var io       = require('socket.io')(http);
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var RedisStore   = require('connect-redis')(session);
var sessionstore = new RedisStore({
    ttl:settings.sessionexpire, //60sec
});

var passportSocketIo = require("passport.socketio");
require('./lib/core/passport.js')({passport:passport}); // pass passport for configuration

// configuration ===============================================================
/*
app.get('bundle.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});

app.get('lang_*', function (req, res, next) {
    next();
});

app.use(express.static(path.join(__dirname, 'views')));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    store: sessionstore,
    key: settings.session.key,
    secret: settings.session.secret
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

*/
// routes ======================================================================

app.get('/', function (req, res, next) {
    res.render("index.ejs")
});

//require('./lib/core/routes.js')({app:app,passport:passport}); 

// launch ======================================================================

//app.listen(port)

http.listen(port, function(){
  console.log('https listening on *:'+port);
});
