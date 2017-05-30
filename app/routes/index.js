'use strict';

var path = process.cwd();
var User = require("../models/users");
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get( function (req, res) {
			res.render('index',{login:req.isAuthenticated()});
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render('profile',{login:true,user:JSON.stringify(req.user)});
		});
	app.route('/mybooks')
		.get(isLoggedIn,function(req,res){
			res.render('mybooks',{login:true});
		});
	app.route('/addbook')
		.get(isLoggedIn,function(req,res){
			res.render('addbook',{login:true});
		})
		.post(isLoggedIn,function(req,res){
			res.render('/mybooks',{login:true});
		});
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter',{
			successRedirect:'/',
			failureRedirect:'/login'
		}));
	app.route('/updateUser')
		.post(isLoggedIn,function(req,res){
			User.update({_id:req.user._id},{city:req.body.city,state:req.body.state,displayName:req.body.name},function(err,user){
				if(err)
				{
					console.log(err);
					return ;
				}
				res.json({success : "Updated Successfully", status : 200});
			})
		});
	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
