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

	app.route('/approval')
		.get(isLoggedIn,function(req,res){
			res.render('unapproved',{login:true})
		});
	app.route('/decide')
		.get(isLoggedIn,function(req,res){
			res.render("booklend",{login:true});
		});

	app.route('/borrowbook')
		.post(isLoggedIn,function(req,res){
			res.send("hello");
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


	app.get('/error',function(req,res){
		res.render('error',{login:req.isAuthenticated()});
	})
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

};
