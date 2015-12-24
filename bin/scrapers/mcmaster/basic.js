var _   =   require('../../../global');
var YEAR	=	2016;
var TERM	=	13;
_.get({
	url:'http://www.timetablegenerator.com/api/v1/school/mcmaster',
	json:true,
	done:function(data){
		var courses	= data.timetables[YEAR][TERM].courses
		for(var i in course){
			parseCourse(courses);
		}
	}
});

function parseCourse(course){
	
	for(var courseName in course){
	}
}