var _   =   require('../../../global');

_.get({
	url:'http://www.timetablegenerator.com/api/v1/school/mcmaster/legacy',
	json:true,
	done:function(data){
		for(var course in data.courses){
			console.log(data.courses[course][0]);
		}
	}
});