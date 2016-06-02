var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ReadSchema= new Schema({
	title:{
		type:String,
		required:true
	},
	link:{
		type:String,
		required:true
	}
});

var Read=mongoose.model('Read',ReadSchema);

module.exports=Read