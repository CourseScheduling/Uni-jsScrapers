/*

	{
		name:String,
		code:String,
		description:String,
		department:String,
		exclusions:String,
		term:String,
		preReqs:[
			[[courseCode]]
		],
		coReqs:[
			[[courseCode]]
		],
		sections[{
			uniq:String,
			type:Enum(C,L,T), //Stands for Course, Lab, and Tutorial respectively
			section:String,
			campus:String,
			instructors:[{
				teacherName:String,
				rating:Float,
				votes:Int,
			}],
			times:[{
				start:Int,
				end:Int,
				day:[Int],
				location:String,
				room:String,
			}],
			students:{
				enrolled:Int,
				waitlisted:Int,
				max:Int,
			}
		}]
	}  
	
*/

//var db	= require('../../db.js');
var mongo	=	require('monk')('mongodb://localhost:27017/schedular');
var Course	=	mongo.get('mcmasterCourse')

var Helper	=	{
	toMin:function(time){
		
	}
}

var Parser	=	{
	term:''
};

Parser.pushData	=	function(line){
	var base	=	{
		name:line.name,
		code:line.code,
		description:'',
		department:line.department,
		exclusions:'',
		term:'',
		preReqs:[],
		coReqs:[],
		sections:[]
	};
	Course.insert(base,function(err,doc){
		
		if(err) throw err;
		
		for(var type in line.section){
			for(var code in line.section[type]){
				var section	=	line.section[type][code];
				
				var times	=	section.r_periods.map(
					a => {
						start:Helper.toMin(a.start)
					}
				)
				
				
				
				var sectionJSON	=	{
					uniq:section.serial,
					type:type,
					section:'',
					campus:'Mcmaster',
					instructors:[],
					times:timeArray,
					students:{
						enrolled:Int,
						waitlisted:Int,
						max:Int,
					}
				}
				
			}
		}
		
		
		Course.update({_id:doc._id}{
									
										sections:	{$push:JSON}
									});
		
	});
}















module.exports	=	Parser;