var DB	= require('../../db.js');


var Parser	=	{
	pushData:function(courseInfo,times){
		DB.query("SELECT course.id FROM ufv.course WHERE course.code=?",[courseInfo.code],function(e,r,v){
			if(e) throw e;

			if(r==undefined||r.length==0){
				DB.insert('ufv.course',{
					code:courseInfo.code,
					term:courseInfo.term,
					name:courseInfo.name,
					credits:courseInfo.credits,
					description:'{none}',
					prereqs:'{none}',
					exclusions:'{none}',
					addedTimeStamp:(new Date / 1E3 | 0)
				},function(e,r){
					//check if course or lab
					if(courseInfo.section.indexOf('#')>-1){
						courseInfo.type='L'
					}else{
						courseInfo.type='C'
					}
					DB.insert('ufv.course_section',{
						courseId:r.insertId,
						campus:courseInfo.campus,
						sectionUniq:courseInfo.crn,
						type:courseInfo.type,
						status:courseInfo.status,
						addedTimeStamp:(new Date / 1E3 | 0)
					},function(e,r){
						times.forEach(function(v,i,a){
							DB.insert('ufv.course_time',{
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
				if(courseInfo.section.indexOf('#')>-1){
					courseInfo.type='L'
				}else{
					courseInfo.type='C'
				}
				DB.insert('ufv.course_section',{
					courseId:r[0].id,
					campus:courseInfo.campus,
					sectionUniq:courseInfo.crn,
					type:courseInfo.type,
					status:courseInfo.status,
					addedTimeStamp:(new Date / 1E3 | 0)
				},function(e,r){
					times.forEach(function(v,i,a){
						DB.insert('ufv.course_time',{
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
var Parser	= {};
Parser.createInstant	=	function(){
		DB.query('SELECT * FROM ufv.course',[],function(e,r,v){
			if(e) throw e;
			for(var i = 0;i<r.length;i++){ 
				DB.insert('ufv.course_instant',{
					courseId:r[i].id,
					tags:'',
					name:r[i].name,
					code:r[i].code
				});
			}
		});
}

Parser.createInstant();

module.exports	=	Parser;