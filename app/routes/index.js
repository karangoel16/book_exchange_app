'use strict';

var path = process.cwd();
var User = require("../models/users");
var Book = require("../models/books");


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
			Book.find({user:{'$ne':req.user._id}}).limit(10).exec(function(err,books)
			{
				res.render('index',{login:req.isAuthenticated(),books:books});
			});	
		});

	app.route('/signup')
		.get(isLoggedIn,function(req,res){
			if(req.isAuthenticated())
			{
				res.redirect('/');
			}
			res.render('signup',{login:false});
		})
		.post(function(req,res){
			var user=new User();
			user.local.username=req.body.username;
			user.setpassword(req.body.password);
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
					console.log(user);
					res.render('mybooks',{login:true,books:user.books});
				});
		});

	

	app.route('/approval')
		.get(isLoggedIn,function(req,res){
			Request.find({})
			res.render('unapproved',{login:true})
		});
	app.route('/decide')
		.get(isLoggedIn,function(req,res){
			res.render("booklend",{login:true});
		});

	app.route('/searchISBN')
		.post(isLoggedIn,function(req,res){
			Book.findOne({ISBN:req.body.ISBN},function(err,book){
				if(err)
				{
					console.log(err);
				}
				if(book!=null)
				{
					console.log("Book exists");
				}
				res.send(book)
			});
		});

};
