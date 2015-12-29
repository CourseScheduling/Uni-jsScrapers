var _   =   require('../../../global');
var dbParser	=	require('./dbParser');

var YEAR	=	2016;
var TERM	=	13;
var TERM_ENUM	=	 {0 : "Fall first quarter",1 : "Fall second quarter",2 : "Fall semester",3 : "Spring first quarter",4 : "Spring second quarter",5 : "Spring semester",6 : "Full school year (Fall and spring semesters)",7 : "Summer first semester first quarter",8 : "Summer first semester second quarter",9 : "Summer first semester",10 : "Summer second semester first quarter",11 : "Summer second semester second quarter",12 : "Summer second semester",13 :  "Full summer",14 :  "Full year",15 :  "Not offered",16 :  "Unscheduled"};

dbParser.term	=	[TERM_ENUM[TERM],YEAR].join(' ');

_.get({
	url:'http://www.timetablegenerator.com/api/v1/school/mcmaster',
	json:true,
	done:function(data){
		var courses	= data.timetables[YEAR][TERM].courses
		for(var i in courses)
			dbParser.pushData(courses[i]);
	}
});

