var DB	= require('../../db.js');


var Parser	=	{
	pushData:function(courseInfo){
		DB.query("SELECT course.id FROM sfu.course WHERE course.code=?",[courseInfo.code],function(e,r,v){
			if(e) throw e;

			if(r==undefined||r.length==0){
				DB.insert('sfu.course',{
					code:courseInfo.code,
					term:courseInfo.term,
					name:courseInfo.name,
					credits:0,
					description:courseInfo.description||'',
					prereqs:courseInfo.prereq,
					exclusions:'{none}',
					addedTimeStamp:(new Date / 1E3 | 0)
				},function(e,r){
					if(e) throw e;
					//check if course or lab
					DB.insert('sfu.course_section',{
						courseId:r.insertId,
						campus:courseInfo.campus,
						sectionUniq:courseInfo.classNumber,
						type:'C',
						status:'Open',
						addedTimeStamp:(new Date / 1E3 | 0)
					},function(e,r){
						courseInfo.times.forEach(function(v,i,a){
							DB.insert('sfu.course_time',{
								sectionId:r.insertId,
								startTime:v.startTime,
								endTime:v.endTime,
								days:v.days
							});
						});
					});
				});
			}else{
				//check if course or lab
				DB.insert('sfu.course_section',{
					courseId:r[0].id,
					campus:courseInfo.campus,
					sectionUniq:courseInfo.classNumber,
					type:'C',
					status:'Open',
					addedTimeStamp:(new Date / 1E3 | 0)
				},function(e,r){
					if(e) throw e;
					console.log({
							sectionId:r.insertId,
							startTime:v.startTime,
							endTime:v.endTime,
							days:v.days
						});
					courseInfo.times.forEach(function(v,i,a){
						DB.insert('sfu.course_time',{
							sectionId:r.insertId,
							startTime:v.startTime,
							endTime:v.endTime,
							days:v.days
						});
					});
				});
			}
		});
	}
}

Parser.createInstant	=	function(){
		DB.query('SELECT * FROM sfu.course',[],function(e,r,v){
			if(e) throw e;
			for(var i = 0;i<r.length;i++){ 
				DB.insert('sfu.course_instant',{
					courseId:r[i].id,
					tags:'',
					name:r[i].name,
					code:r[i].code
				});
			}
		});
}


module.exports	=	Parser;