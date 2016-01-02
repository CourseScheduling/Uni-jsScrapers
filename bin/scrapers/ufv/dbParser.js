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
					).uniq();
			
			var Section	=	{
				title:courseJSON.title,
				type:'',
				uniq:main.crn,
				section:main.section,
				campus:main.campus,
				times:times,
			}
			Section.type	=	type;
			courseJSON.instructors	=	Instructors;
			courseJSON.sections[type]	=	[Section];
			UFV.find({title:courseJSON.title},function(err,docs){
				if(err) throw err;
				if(docs.length){
					console.log('Updating '+docs[0].title);

					if(type	==	"C"){
						UFV.update({_id:docs[0]._id},{
							$addToSet:{instructors:{$each:Instructors}},
							$push:{'sections.C':Section}
						},function(e){
							if(e) throw e;
						});
					}
					else{
						UFV.update({_id:docs[0]._id},{
							$addToSet:{sectionTypes:type,instructors:{$each:Instructors}},
							$push:{'sections.L':Section}
						},function(e){
							if(e) throw e;
						});
					}
					
				}else{
					UFV.insert(courseJSON);
				}
				
			})
			
		},
		createInstant:function(){
			var UFV		=	mongo.get('ufvCourse');
			var db	= require('../../db.js');
			//Stop word regex
			var stop	=	/  | a | about | above | above | across | after | afterwards | again | against | all | almost | alone | along | already | also | although | always | am | among | amongst | amoungst | amount | an | and | another | any | anyhow | anyone | anything | anyway | anywhere | are | around | as | at | back | be | became | because | become | becomes | becoming | been | before | beforehand | behind | being | below | beside | besides | between | beyond | bill | both | bottom | but | by | call | can | cannot | cant | co | con | could | couldnt | cry | de | describe | detail | do | done | down | due | during | each | eg | eight | either | eleven | else | elsewhere | empty | enough | etc | even | ever | every | everyone | everything | everywhere | except | few | fifteen | fify | fill | find | fire | first | five | for | former | formerly | forty | found | four | from | front | full | further | get | give | go | had | has | hasnt | have | he | hence | her | here | hereafter | hereby | herein | hereupon | hers | herself | him | himself | his | how | however | hundred | ie | if | in | inc | indeed | interest | into | is | it | its | itself | keep | last | latter | latterly | least | less | ltd | made | many | may | me | meanwhile | might | mill | mine | more | moreover | most | mostly | move | much | must | my | myself | name | namely | neither | never | nevertheless | next | nine | no | nobody | none | noone | nor | not | nothing | now | nowhere | of | off | often | on | once | one | only | onto | or | other | others | otherwise | our | ours | ourselves | out | over | own | part | per | perhaps | please | put | rather | re | same | see | seem | seemed | seeming | seems | serious | several | she | should | show | side | since | sincere | six | sixty | so | some | somehow | someone | something | sometime | sometimes | somewhere | still | such | system | take | ten | than | that | the | their | them | themselves | then | thence | there | thereafter | thereby | therefore | therein | thereupon | these | they | thickv | thin | third | this | those | though | three | through | throughout | thru | thus | to | together | too | top | toward | towards | twelve | twenty | two | un | under | until | up | upon | us | very | via | was | we | well | were | what | whatever | when | whence | whenever | where | whereafter | whereas | whereby | wherein | whereupon | wherever | whether | which | while | whither | who | whoever | whole | whom | whose | why | will | with | within | without | would | yet | you | your | yours | yourself | undefined | yourselves | the |  /gi;

			UFV.find({},function(e,docs){
				docs.forEach(function(doc,i,a){
					var tags = "";
					var sum	=	doc.name+' '+doc.description;
					tags	=	sum.replace(/[^A-Za-z ]/g,'').toLowerCase().replace(stop,' ').trim();
					db.query('INSERT INTO course.ufv_course_instant (tags,name,code,term,year) VALUES (?,?,?,?,?)',[tags,doc.name,doc.title,doc.term,doc.year]);
				});
			});

			//ALTER TABLE ufv_course_instant add fulltext INDEX ufvCourse (tags)
		}
	};
	
}














Parser.preMangle	=	function(){
	var UFV		=	mongo.get('ufvCourse');
	UFV.find({},function(e,docs){
		if(e) throw e;
		docs.forEach(function(course,i,a){
			var n = Mangler(course);
			UFV.update({_id:course._id},{
				$push:{mangled:{$each:n}}
			},function(e){
				if(e) throw e;
			});
		});
	})
}









//My giant thing for mangling.

function Mangler(course){
	var typeArray	=	[];
	var mangled	=	[];
	var TIME	=	{
		inTime:function(start,end,start2,end2){
				if(start==0||start2==0)
						return false;
				if((((start2>=start)&&(start2<end))||((end2>start)&&(end2<end)))||(((start>=start2)&&(start<end2))||((end>start2)&&(end<end2))))
						return true;
				return false;
		},
		sameArr:function(day1,day2){
				if(day1[0]==-1||day2[0]==-1)
								return false;
				for (var i = 0; i < day1.length; i++) {
						if (day2.indexOf(day1[i]) > -1) {
								return true;
						}
				}
				return false;
		}
	};
	if(course.sectionTypes.length==1){
		return course.sections[course.sectionTypes[0]].map(a=>[a.uniq]);
	}
	for(var type in course.sections)
		typeArray.push(course.sections[type]);
	typeArray.sort((a,b)=>(b.length-a.length));
	typeArray[0].forEach(function(v,i,a){
		depther([v],1,typeArray);
	});
	mangled	=	mangled.filter(a => (a.length==1||a[0].campus==a[1].campus)).map(a => a.map(b => b.uniq)).map(a => JSON.stringify(a)).uniq().map(a => JSON.parse(a));
	
	
	return mangled;
	//make sure to sort the layers by section length before doing this.
	function	depther(pos,layerIndex,layerArray){
		var layer	=	layerArray[layerIndex];
		if(pos[pos.length-1].campus=="Online: UFV")
			return mangled.push([pos[pos.length-1]]);
		if(layerIndex>layerArray.length||layer.length==0)
			return mangled.push(pos);
		var layerC	=	layer.length;
		up:
		while(layerC--){
			var sectionC	=	pos.length;
			while(sectionC--){
				var timeL	=	layer[layerC].times.length;
				while(timeL--){
					var timeS	=	pos[sectionC].times.length;
					while(timeS--){
						var pST	=	pos[sectionC].times[timeS];
						var lST	=	layer[layerC].times[timeL];
						if(TIME.sameArr(pST.days,lST.days)&&TIME.inTime(lST.start,lST.end,pST.start,pST.end)){
							continue up;
						}
					}
				}
			}
			if(layerIndex==layerArray.length)
				mangled.push(pos);
			else
				depther(pos.concat(layer[layerC]),layerIndex+1,layerArray);
		}
	}


}








Parser.addTeacher	=	function(){
	var _   =   require('../../../global');
	_.get({
		url:'http://search.mtvnservices.com/typeahead/suggest/?solrformat=true&rows=20&callback=&q=schoolid_s%3A1425&defType=edismax&qf=teacherfullname_t%5E1000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=&siteName=rmp&rows=2000&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s',
		json:true,
		done:function(e){
			e.response.docs.forEach(function(v,i,a){
				db.query('INSERT INTO course.ufv_teacher_rating (teacherName,rating,votes) VALUES (?,?,?)',[
					v.teacherfirstname_t+' '+v.teacherlastname_t,
					v.averageratingscore_rf,
					v.total_number_of_ratings_i
				]);
			});
		}
	});
	function process(a){
		console.log(a.response.docs);
	}
}








































module.exports	=	Parser;