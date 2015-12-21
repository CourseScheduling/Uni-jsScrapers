var DB	= require('../../db.js');
var Parser  = {
  pushData:function(line){
		try{
			var json  = JSON.parse(line); // Parse the JSON in the line
		}
		catch(e){
			console.log(e,'\n',line);
			return;
		}
		var sql	=	"INSERT INTO uvic.course (code,campus,term,name) VALUES (?,?,?,?)";

		DB.query(sql,[
			json.code,
			'UVic',
			'Winter 2016',
			json.name
		],function(e,r){
			if(e) throw e;
			var sql	=	"INSERT INTO uvic.course_info (courseId,description,prereqs,exclusions) VALUES (?,?,?,?)"
			DB.query(sql,[r.insertId,json.description,json.prerequisites,json.exclusions]);
			var sql	=	"INSERT INTO uvic.course_section (courseId,campus,location,sectionUniq,instructor) VALUES (?,?,?,?,?)";
			json.meeting_sections.forEach(function(section,i,a){
				DB.query(sql,[r.insertId,json.campus,json.division,section.code,section.instructors.join(',')],function(e,r){
					var sql	=	"INSERT INTO uvic.course_time (sectionId,startTime,endTime,days) VALUES(?,?,?,?)";
					section.times.forEach(function(time,i,a){
						DB.query(sql,[r.insertId,time.start*60,time.end*60,time.day]);
					});
				});
			});
		});
  }
}





module.exports  = Parser;