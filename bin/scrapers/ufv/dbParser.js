var db	= require('../../db.js');
var mongo	=	require('monk')('localhost/schedular');

//var db	= require('../../db.js');
var mongoose	=	require('mongoose');
mongoose.connect('mongodb://localhost:27017/schedular',{},function(){
	console.log('h');
});

var courseSchema = new mongoose.Schema({
  id:String,
  code:String,
  name:String,
  description:String,
  term:String,
  sections:{type:Array,default:[]}
});



var Course	=	mongoose.model('Course',courseSchema,'ufvCourse');

var Parser	=	{};




Parser.pushData	=	function(main,times){
	
	var course	=	new Course({
		id:main.id,
		code:main.code,
		name:main.name,
		description:main.description,
  	term:main.term,
  	sections:[{
			crn:main.crn,
			campus:main.campus,
			times:times
		}]
	});
	Course.find({code:main.code},function(e,doc){
		if(e) throw e;
		if(doc.length==0){
			console.log('None found');
			course.save(function(e,d){
				if(e) throw e;
			});
		}else{
			console.log('Updating: '+main.code);
			Course.update({code:main.code},{
				$push:{
					sections:{
						campus:main.campus,
						crn:main.crn,
						times:times
					}
				}
			},function(e,doc){
				if(e) throw e;
			});
		}
	});
}





module.exports	=	Parser;