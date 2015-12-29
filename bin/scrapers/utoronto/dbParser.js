/*

	{
		name:String,
		code:String,
		type:Enum(C,L,T), //Stands for Course, Lab, and Tutorial respectively
		description:String,
		exclusions:String,
		preReqs:[
			[[courseCode]]
		],
		coReqs:[
			[[courseCode]]
		],
		sections{
			uniq:String,
			section:String,
			campus:String,
			instructors:[{
				teacherName:String,
				rating:Float,
				votes:Int,
			}],
			times:[{
				startTime:Int,
				endTime:Int,
				day:[Int],
				location:String,
				room:String,
			}],
			students:{
				enrolled:Int,
				waitlisted:Int,
				max:Int,
			}
		}
	}  
	
*/

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
  department:String,
	exclusions:String,
  prerequisites:String,
  exclusions:String,
  level:Number,
  term:String,
  sections:{type:Array,default:[]}
});



var Course	=	mongoose.model('Course',courseSchema,'utorontoCourse');






var Parser	=	{};
var DAYS	=	{
	"MONDAY":"0",
	"TUESDAY":"1",
	"WEDNESDAY":"2",
	"THURSDAY":"3",
	"FRIDAY":"4",
	"SATURDAY":"5",
	"SUNDAY":"6",
};


Parser.pushData	=	function(line){
	
	//console.log('Pushing line...');
	if(line.meeting_sections!==undefined)
		line.meeting_sections	=	line.meeting_sections.map(function(a){
			a.campus	=	line.campus;
			a.times	=	a.times.map(function(time){
				time.day	=	DAYS[time.day];
				return time;
			});
			return a;
		});
	var course	=	new Course({
		id:line.id,
		code:line.code,
		name:line.name,
		exclusions:line.exclusions,
		description:line.description,
  	department:line.department,
  	prerequisites:line.prerequisites,
  	exclusions:line.exclusions,
  	level:line.level,
  	term:line.term,
  	sections:line.meeting_sections||[]
	});
	course.save(function(err,data){
		if(err) throw err;
	});
}





module.exports	=	Parser;