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
	}
});