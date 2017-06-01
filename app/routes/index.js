'use strict';

var path = process.cwd();
var User = require("../models/users");
var Book = require("../models/books");
var Request = require("../models/request");

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}


	app.route('/')
		.get( function (req, res) {
			Book.find({user:{'$ne':req.user._id}}).limit(100).exec(function(err,books)
			{
				res.render('index',{login:req.isAuthenticated(),books:books});
			});	
		});

	app.route('/signup')
		.get(function(req,res){
			if(req.isAuthenticated())
			{
				res.redirect('/');
			}
			res.render('signup',{login:false});
		})
		.post(function(req,res){
			var user=new User();
			user.service="local";
			user.local.username=req.body.username;
			user.setPassword(req.body.password);
			console.log("reached here");
			user.save(function(err){
				if(err){
					console.log(err);
					return err;
				}
				console.log("save local success");
			})
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login',{login:false});
		})
		.post(
			passport.authenticate('local'),function(req,res){
					res.redirect('/');
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
			User.findOne({_id:req.user._id}).populate('books').exec(function(err,user){
					if(err)
					{
						console.log(err);
						return ;
					}
					res.render('mybooks',{login:true,books:user.books});
				});
		});

	

	app.route('/unapproved')
		.get(isLoggedIn,function(req,res){
			Request.find({to:req.user._id}).populate('book').exec(function(err,book){
				if(err){
					console.log(err);
					return ;
				}
				res.render('unapproved',{login:true,books:book});
			});
		});

};
