/*

	{
		name:String,
		title:String,
		courseId:String,
		department:String,
		code:String,
		description:String,
		exclusions:String,
		term:Int,
		preReqs:[
			[[courseCode]]
		],
		coReqs:[
			[[courseCode]]
		],
		sections:{
		
		C : [{
			uniq:String,
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
				days:[Int],
				location:String,
				room:String,
				online:Boolean
			}],
			students:{
				enrolled:Int,
				waitlisted:Int,
				max:Int,
				full:null
			}
		}],
		L:[],
		T:[]
		
		}
	}
	
*/
var db	= require('../../db.js');
var mongo	=	require('monk')('mongodb://localhost:27017/schedular');


Parser	=	function(termCode,year){
	this.term	=	termCode;
	this.year =	year;
}

Parser.prototype.pushData	=	function(main,times){
	
	var JSON	=	{	
		term:this.termCode,
		year:this.year,
		title:main.name,
		name:
		department:main.department,
		code:main.code,
		description:"",
		exclusions:"",
		preReqs:[],
		coReqs:[],
		sections:{
			C:[],
			L:[],
			T:[],
		}
	}
	
	if(main.section.
	
	
	Course.find({code:main.code},function(e,doc){
		if(e) throw e;
		if(doc.length==0){
			console.log('None found');
			mongo.get('ufvCourse').insert(JSON);
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