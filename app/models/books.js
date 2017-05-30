'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require('./users')
var book=new Schema({
	name:{
		type:String,
		required:true
	},
	thumbnail:{
		type:String,
		required:true
	},
	ISBN:{
		type:String,
		required:true
	},
	status:{
		type:Boolean,
		default:false
	},
	user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Book', book);