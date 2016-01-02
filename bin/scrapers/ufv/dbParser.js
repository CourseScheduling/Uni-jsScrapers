/*

	{
		name:String,	//	name of the course e.g. Intro to the history of Joseph
		title:String,	//	the combination of department and code e.g. JOE101
		department:String,	//Department e.g.	JOE
		code:String,	//	Code of the course e.g. 101
		description:String,	//Desciption e.g. "Joseph is Awesome"
		exclusions:String,	//Exclusions e.g. "Haters not allowed"
		term:Int,	//Term is from the term enum from timetablegenerator guy
		year:Int,	//Year this course is offered
		status:String,	//Open Closed etc.
		preReqs:[	
			[[courseCode]]
		],
		coReqs:[
			[[courseCode]]
		],
		sectionTypes:['C'],	//The types of section available
		mangled:[
			{
				C:Section_Ref,
				L:Section_Ref,
				T:Section_Ref
			}
		],	//Look at mangled theory in the docs for more info
		sections:{
		C : [{
			title:String,	//same as parent title
			type:ENUM('C','L','T'),	//Type of section
			uniq:String,	//unique code identifying the section e.g. CRN? Lecture code?
			section:String,	// unique string identifying the section e.g. D100 , C#J, etc.
			campus:String,	// Place where the section is held, e.g. Heaven
			instructors:[{
				tN:String,	//The teacher name
				r:Float,	//The teacher rating
				v:Int,	//number of teacher votes
			}],
			times:[{
				startDate:String,	//When in the scope of days, does this period start?
				endDate:String	//When in the scope of days does this period end?
				start:Int,	// When does this period start?
				end:Int,	// What time does this period end?
				days:[Int],	// Days this period is offered; 1=Monday, 2=Tuesday, and so on..
				location:String,	//Location of the course, e.g. Heaven, near the pool with hot lesbians
				room:String,	//Room this course is held in
				online:Boolean	//Is this course located on line?
			}],
			students:{
				e:Int,	//Enrolled students
				w:Int,	//waitlisted students
				m:Int,	//max amount of students in this section
				f:null	//Is this section full?
			}
		}],
		L:[],
		T:[]
		
		}
	}
	
*/
var db	= require('../../db.js');
var mongo	=	require('monk')('mongodb://localhost:27017/schedular');

Array.prototype.uniq = function(){
	 for(var i = 0, l = this.length; i < l; ++i){
				var item = this[i];
				var dublicateIdx = this.indexOf(item, i + 1);
				while(dublicateIdx != -1) {
						this.splice(dublicateIdx, 1);
						dublicateIdx = this.indexOf(item, dublicateIdx);
						l--;
				}
	 }
	 return this;
}


Parser	=	function(termCode,year){
	return {
		pushData	:	function(main,times){
			
			var UFV		=	mongo.get('ufvCourse');
			var type	=	((main.section.indexOf('#')==-1)?"C":"L");
			
			var courseJSON	=	{
				name:main.name,
				title:main.department+main.code,
				department:main.department,
				code:main.code,
				status:main.status,
				description:"",
				exclusions:"",
				term:termCode,
				year:year,
				preReqs:[],
				coReqs:[],
				sectionTypes:['C'],	//Don't all courses require a lecture section?
				mangled:[],
				sections:{C:[],L:[],T:[]},
				instructors:[]
			}
			var Instructors	=	
					times.map(
						i =>
						(i.instructor&&i.instructor.replace(/\(Primary\)/,"").trim())
					).filter(
						i => (i.trim()!=="")
					).uniq().map(
						i => ({tN:i,r:0.0,v:0})
					)
			
			var Section	=	{
				title:courseJSON.title,
				type:'C',
				uniq:main.crn,
				section:main.section,
				campus:main.campus,
				//times:times,
			}
			Section.type	=	type;
			courseJSON.instructors	=	Instructors;
			courseJSON.sections[type]	=	[Section];
			UFV.find({title:courseJSON.title},function(err,docs){
				if(err) throw err;
				if(docs.length){
					console.log('Updating '+docs[0].title);

					if(type	==	"C")
						UFV.update({title:courseJSON.title},{
							$push:{C:Section},
							$push:{instructors:{$each:Instructors}}
						},function(e){
							if(e) throw e;
						});
					else(type	==	"L")
						UFV.update({title:courseJSON.title},{
							$push:{L:Section},
							$addToSet:{sectionTypes:type},
							$push:{instructors:{$each:Instructors}}
						},function(e){
							if(e) throw e;
						});

				}else{
					UFV.insert(courseJSON);
				}
				
			})
			
		}
	};
	
}



module.exports	=	Parser;