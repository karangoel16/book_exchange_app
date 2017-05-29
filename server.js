'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var user_routes=require('./app/routes/user.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var engine = require('ejs-locals');
var bodyparser = require('body-parser');
var path= require('path');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/app/views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);
user_routes(app,passport);//this is to make code more readable

var port = process.env.PORT || 8080;

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
