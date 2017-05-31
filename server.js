'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var user_routes = require('./app/routes/user.js');
var book_routes = require('./app/routes/book.js');
var mongoose = require('mongoose');
var passport = require('passport');
var favicon = require('serve-favicon')
var session = require('express-session');
var engine = require('ejs-locals');
var bodyparser = require('body-parser');
var path= require('path');
var mongoStore = require('connect-mongo')(session);

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use(favicon(path.join(__dirname, 'public/img/', 'download.png')));
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
	saveUninitialized: true,
	store: new mongoStore({
		url:process.env.MONGO_URI,
		autoRemove:'native'
	})
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);
user_routes(app,passport);
book_routes(app,passport);

//these are the last routes that will be used in case of any error

app.get('/error',function(req,res){
		res.render('error',{login:req.isAuthenticated()});
	});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
        	login:req.isAuthenticated(),
            message: err.message,
            error: err
        });
    });
	}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
    	login:req.isAuthenticated(),
        message: err.message,
        error: {}
    });
});

app.get('*', function(req, res){
  		res.render('404',{login:req.isAuthenticated()});
	});
var port = process.env.PORT || 8080;

app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
