var db	= require('../../db.js');
var mongoose	= require('../../mongo.js');

var courseSchema = new mongoose.Schema({
	crn:String,
	status:String,
	code:String,
	section:String,
	name:String,
	credits:Number,
	campus:String,
	type:String,
	status:String,
	term:String,
  name:String,
  description:String,
	times:
});


    var JSON    =   {
    }



var Course	=	mongoose.model('Course',courseSchema);







var Parser	=	{};

Parser.pushData	=	function(courses,times){

	new Course({
		
	});

}





module.exports	=	Parser;