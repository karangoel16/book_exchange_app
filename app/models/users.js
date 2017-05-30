'use strict';

var mongoose = require('mongoose');
var Books = require('./books');
var Schema = mongoose.Schema;

var User = new Schema({
	service:String,
	displayName:String,
	twitter:{
		id:String,	
		username:String
	},
	github: {
		id: String,
		username: String,
      		publicRepos: Number
	},
   nbrClicks: {
      clicks: Number
   },
   books:[{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
   city:String,
   state:String,
});
User.methods.addbook = function(book){
	this.update({$push:{books:book}},function(err){
		if(err)
		{
			console.log(err);
			return;
		}
		console.log("successfully added");
	});
}
module.exports = mongoose.model('User', User);
