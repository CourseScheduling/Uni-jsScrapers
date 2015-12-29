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
				days:[Int],
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

var db	= require('../../db.js');
var mongo	=	require('monk')('mongodb://localhost:27017/schedular');
var Course	=	mongo.get('mcmasterCourse')

var Helper	=	{
	toMin:function(time){
		if(time==undefined)
			return 0;
		return (time.split(':')[0]*60)+(time.split(':')[1]*1)
	}
}

var Parser	=	{
	term:''
};

Parser.pushData	=	function(line,cb){
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
	var s = 0,first	=	true,last=0;
	var n = setInterval(function(){
		if(s==0&&!first){
			console.log('Done! '+line.code);
			clearInterval(n)
			cb&&cb();
		}else{
			if(s!==last){
				console.log(s);
				last	=	s;
			}
		}
	},0);
	
	Course.insert(base,function(err,doc){
		if(err) throw err;
		for(var type in line.sections){
			for(var code in line.sections[type]){
				s++;
				first=false;
				//easy section access
				var section	=	line.sections[type][code];
				
				//get times formatted as above schema
				var times	=	section.r_periods.map(
					a => ({
						start:Helper.toMin(a.start),
						end:Helper.toMin(a.end),
						days:[a.day-1],
						location:a.room,
					})
				);//I love es6 now
				
				//grab all the instructor names
				var instructors	=	{};
				section.r_periods.forEach(
					a	=>	a.supervisors.forEach(
						b	=> (
							(instructors[b]	=	1)
						)
					)
				)
				
				//push the section into previous course
				var sectionJSON	=	{
					uniq:section.serial,
					type:type,
					section:'',
					campus:'Mcmaster',
					instructors:Object.keys(instructors),
					times:times,
					students:{
						enrolled:0,
						waitlisted:0,
						max:0,
					}
				}
				Course.updateById(doc._id,{		
					$push	:	{
						sections:sectionJSON
					}
				},function(err,doc){
					if(err) throw err;
					s--;
				});
			}
		}
		
		
		
	});
}

Parser.createInstant	=	function(){
	var db	= require('../../db.js');
	//Stop word regex
	var stop	=	/  | a | about | above | above | across | after | afterwards | again | against | all | almost | alone | along | already | also | although | always | am | among | amongst | amoungst | amount | an | and | another | any | anyhow | anyone | anything | anyway | anywhere | are | around | as | at | back | be | became | because | become | becomes | becoming | been | before | beforehand | behind | being | below | beside | besides | between | beyond | bill | both | bottom | but | by | call | can | cannot | cant | co | con | could | couldnt | cry | de | describe | detail | do | done | down | due | during | each | eg | eight | either | eleven | else | elsewhere | empty | enough | etc | even | ever | every | everyone | everything | everywhere | except | few | fifteen | fify | fill | find | fire | first | five | for | former | formerly | forty | found | four | from | front | full | further | get | give | go | had | has | hasnt | have | he | hence | her | here | hereafter | hereby | herein | hereupon | hers | herself | him | himself | his | how | however | hundred | ie | if | in | inc | indeed | interest | into | is | it | its | itself | keep | last | latter | latterly | least | less | ltd | made | many | may | me | meanwhile | might | mill | mine | more | moreover | most | mostly | move | much | must | my | myself | name | namely | neither | never | nevertheless | next | nine | no | nobody | none | noone | nor | not | nothing | now | nowhere | of | off | often | on | once | one | only | onto | or | other | others | otherwise | our | ours | ourselves | out | over | own | part | per | perhaps | please | put | rather | re | same | see | seem | seemed | seeming | seems | serious | several | she | should | show | side | since | sincere | six | sixty | so | some | somehow | someone | something | sometime | sometimes | somewhere | still | such | system | take | ten | than | that | the | their | them | themselves | then | thence | there | thereafter | thereby | therefore | therein | thereupon | these | they | thickv | thin | third | this | those | though | three | through | throughout | thru | thus | to | together | too | top | toward | towards | twelve | twenty | two | un | under | until | up | upon | us | very | via | was | we | well | were | what | whatever | when | whence | whenever | where | whereafter | whereas | whereby | wherein | whereupon | wherever | whether | which | while | whither | who | whoever | whole | whom | whose | why | will | with | within | without | would | yet | you | your | yours | yourself | undefined | yourselves | the |  /gi;

Course.find({},function(e,docs){
	docs.forEach(function(doc,i,a){
		var tags = "";
		var sum	=	doc.name+' '+doc.description;
		tags	=	sum.replace(/[^A-Za-z ]/g,'').toLowerCase().replace(stop,' ').trim();
		db.query('INSERT INTO course.mcmaster_course_instant (tags,name,code) VALUES (?,?,?)',[tags,doc.name,doc.code]);
	});
});
	
	
}















module.exports	=	Parser;