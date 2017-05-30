'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
	}
});

module.exports = mongoose.model('Book', book);