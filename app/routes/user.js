'use strict'
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
};