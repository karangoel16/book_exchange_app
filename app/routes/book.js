'use strict';
//this contains all books related routes
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
	app.route("/requestbook")
		.get(isLoggedIn,function(req,res){
			Request.find({from:req.user._id}).populate('book').exec(function(err,request){
				if(err){
					console.log(err);
					return ;
				}
				res.render('request',{login:true,request:request});
			});
		});
	app.route("/deletebook")
		.post(isLoggedIn,function(req,res){
			req.user.deletebook(req.body.id);
			Request.find({book:req.body.id}).remove().exec(function(err){
					if(err)
					{
						console.log(err);
						return ;
					}
					console.log("request deleted successfully");
				});
			Book.findOne({_id:req.body.id},function(err,book){
				if(err){
					console.log(err);
					return;
				}
				book.remove();
				res.json({success : "Updated Successfully", status : 200});
				console.log("successfully delete");
			});
		});

	app.route('/addbook')
		.get(isLoggedIn,function(req,res){
			res.render('addbook',{login:true});
		})
		.post(isLoggedIn,function(req,res){
			console.log(req.body);
			var book=new Book({
				name:req.body.book,
				thumbnail:req.body.Link,
				ISBN:req.body.ISBN,
				user:req.user._id
			});
			book.save(function(err)
			{
				if(err)
				{
					console.log(err);
					res.redirect('/error');
				}
				req.user.addbook(book._id);
				res.redirect('/mybooks');
			});
		});

	app.route('/returnBook')
		.get(isLoggedIn,function(req,res){
			Request.find({'to':req.user._id,status:"Approve"}).populate('book').exec(function(err,Request){
					if(err)
					{
						console.log(err);
						return ;
					}
					console.log(Request);
					res.render('retBook',{login:true,request:Request});
				});
			});

	app.route('/borrowbook')
		.post(isLoggedIn,function(req,res){
			Book.findOne({_id:req.body.id,status:false},function(err,book){
				book.updateRequest();//this is called to set status to true so that no other can request book
				book.save(function(err)
				{
					if(err){
					console.log(err);
					return ;
					}
					console.log("status changed successfully");
				});
				var request=new Request();
				request.from=book.user;
				request.to = req.user._id;
				request.book=book._id;
				request.save(function(err){
					if(err)
					{
						console.log(err);
					}
					res.json({success : "Updated Successfully", status : 200});
					console.log("Request successfully added");
				})
			});
		});
};