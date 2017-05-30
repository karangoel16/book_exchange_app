'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStratergy= require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	passport.use(new TwitterStratergy({
		consumerKey: configAuth.twitterAuth.clientID,
		consumerSecret:configAuth.twitterAuth.clientSecret,
		callbackURL:configAuth.twitterAuth.callbackURL
	},function(token,refreshToken,profile,done){
		User.findOne({'twitter.id':profile.id},function(err,user){
			if(err){
				return done(err);
			}
			if(user){
				return done(null,user);
			}
			else{
				var newUser = new User();
				newUser.service="twitter";
				newUser.twitter.id = profile.id;
				newUser.twitter.username = profile.username;
				newUser.displayName = profile.displayName;
				newUser.nbrClicks.clicks = 0;
				newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
				});
			}
		});
	}));
	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.service="github";
					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
	passport.use(new LocalStrategy(function(username,password,done)
    {
        User.findOne({user:username},function(err,user)
        {
            if(err)
            {
                return done(err);
            }
            if(!user)
            {
                return done(null,false,{message:'Incorrect username'});
            }
            var check=user.validatePassword(password);
            if(check===true)
            {
                //console.log(req.isAuthenticated);
                return done(null,user);
            }
            else
            {
               return done(null,false,{message:'Incorrect Password'});
            }
        });
    }));
};
