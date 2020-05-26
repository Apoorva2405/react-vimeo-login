var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , VimeoStrategy = require('passport-vimeo-oauth2').Strategy;
  const app = express();
  const cp = require("cookie-parser");
  var bodyParser = require('body-parser'); 
  var logger = require('morgan');
  var session = require('express-session');
  var methodOverride = require('method-override');
  var multer = require('multer');


var VIMEO_CONSUMER_KEY = "ef71c42f8ff30c32d54d3f38ce7b59d237348c1e";
var VIMEO_CONSUMER_SECRET = "dEmcMijFFA9cMUxNR6txB8AXRVFDo1akqs4uPsspw+XJwfWkDfXQt2uMNPa+XtmcC17bZ1eiPC5HkZSmVj6yskYh4+YwvGzyKd0A78UXpVpEKmRxagUEuNGEtIkeppcv";



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



passport.use(new VimeoStrategy({
  // authorizationURL: 'https://www.example.com/oauth2/authorize',
  // tokenURL: 'https://www.example.com/oauth2/token',
  clientID: VIMEO_CONSUMER_KEY,
  clientSecret: VIMEO_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/vimeo/callback"
  },
  function(token, tokenSecret, profile, done) {
      process.nextTick(function () {
      return done(null, profile);
    });
  }
));





// configure Express
// app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(logger());
  app.use(methodOverride());
  app.use(cp());
  app.use(bodyParser.urlencoded({
    extended: true
}));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(multer());
  app.use(express.static(__dirname + '/public'));
// });


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


app.get('/auth/vimeo',
  passport.authenticate('vimeo'),
  function(req, res){
  });


app.get('/auth/vimeo/callback', 
  passport.authenticate('vimeo', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
