//this is made to see if we can put all the request here
'use strict';
var mongoose=require('mongoose');
var User = require('./users');
var Books=require('./books');
var Schema = mongoose.Schema;

var requireSchema= new Schema({
	from:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	to:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	book:{type:mongoose.Schema.Types.ObjectId,ref:'Book'},
	status:Boolean
});

module.exports = mongoose.model('Require',requireSchema);