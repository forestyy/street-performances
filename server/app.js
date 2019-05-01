const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// local dependencies
const db = require('./db');
// // const passport = require('./passport');
const api = require('./api');

app.set('socketio', io);

const publicPath = path.resolve(__dirname, "..", "client", "dist");

app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true'
}));

// app.use(passport.initialize());
// app.use(passport.session());

// set POST request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// // authentication routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// app.get(
//   '/auth/google/callback',
//   passport.authenticate(
//     'google',
//     { failureRedirect: '/login' }
//   ),
//   function(req, res, next) {
//     res.redirect('/feed');
//   }
// );

// app.get('/logout', function(req, res) {
//   //req.session.destroy();
//   req.logOut();
//   res.redirect('/'); 
// });

app.use('/api', api);
app.use(express.static(publicPath));

http.listen((process.env.PORT || 3000), () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});

// app.use('/favicon.ico', express.static(publicPath + '/dist/favicon.ico'));



