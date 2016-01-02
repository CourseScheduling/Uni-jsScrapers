/*
term codes 
	{
	 "0" : "Fall first quarter",
		"1" : "Fall second quarter",
		"2" : "Fall semester",
		"3" : "Spring first quarter",
		"4" : "Spring second quarter",
		"5" : "Spring semester",
		"6" : "Full school year (Fall and spring semesters)",
		"7" : "Summer first semester first quarter",
		"8" : "Summer first semester second quarter",
		"9" : "Summer first semester",
		"10" : "Summer second semester first quarter",
		"11" : "Summer second semester second quarter",
		"12" : "Summer second semester",
		"13" :  "Full summer",
		"14" :  "Full year",
		"15"	: "Winter semester",
		"16" :  "Not offered",
		"17" :  "Unscheduled"
	}
	
*/

//Our daily reminder
var JosephIsAwesome =   true;
//Initialize constants
var SEMESTER    =   "Winter"; //Can be Summer, Winter or, Fall
var TERM_CODE		=		15;
var YEAR    =   2016; //Remember this is 1 year after the year you're in typing this.
var INTERACTIVE_SESSION  =   "322541";

// Load all the libraries
var fs  =   require('fs');
var cheerio = require('cheerio');
var _   =   require('../../../global');
// Pass some of the initialized variables to the parser
var dbParser	=	require('./dbParser')(TERM_CODE,YEAR);
var SEMESTER_OBJECT  =   {
    Fall:"09"
    ,Winter:"01"
    ,Summer:"05"
};

var CRN_URL =   [
    "http://www.ufv.ca/arfiles/includes/",
    YEAR,
    SEMESTER_OBJECT[SEMESTER],
    "-timetable-with-changes.htm"
].join('');   //The url we will use to get crns

var COURSE_URL  =   [
    "https://warden.ufv.ca:8910/prod/bwysched.p_display_course?wsea_code=CRED&term_code=",
    YEAR,
    SEMESTER_OBJECT[SEMESTER],
    "&session_id=",
    INTERACTIVE_SESSION,
    "&crn="
].join('');

//The type of data we're going to put into the DB


var CRN_ARRAY    =   [];



//Grab the crnData
fs.readFile('./crns.dat',function(err,data){
    if(data === undefined){
        console.log('data file Does Not Exist');
        _.get({
            url:CRN_URL,
            json:false,
            done:function(data){
                //Remove all the html and create an array of every 5 digit number
                //Get all 5 digit numbers in the last html element,convert it to a number and store it as a number into the CRN_ARRAY
                CRN_ARRAY   =   data.replace(/(<([^>]+)>)/ig,"").match(/(\d\d\d\d\d)/g);
                fs.writeFile('./crns.dat',CRN_ARRAY.join('.'));
                //Start the program!
                main();
            }
        });
        
        return;
    }else{
        console.log('data file Exists');
        CRN_ARRAY   =   data.toString().split('.');
        main();
        return;
    }
});



var possibleGrades  =   [
        "D-"," D"," D+",
        "C-"," C"," C+",
        "B-"," B"," B+",
        "A-"," A"," A+"                        
    ];



//Parser for the basic course info
function parseCourseBasic(DOM){
    var fields  =   [
        "CRN:",
        "Subject:",
        "Title:",
        "Academic Credits:",
        "Schedule Type:",
        "Campus:",
        "Status:",
				//Extra stuff
				"Degree Restriction:",
				"Prerequisites:",
				"Actual Waitlist:",
				"Actual Enrolment:",
				"Maximum Enrolment:",
				"Class Restriction:",
				"Major Restriction:",
				"Program Restriction:",
				"Level Restriction:",
				"Instructor:",
				"Course Description:",
				"Course Text:",
				"Course Dates:"
    ];
    var JSON    =   {
        crn:"",
        status:"",
        code:"",
        section:"",
        name:"",
        credits:0.0,
        campus:"",
        type:"",
				term:SEMESTER+' '+YEAR
    };
			var index = 0;
    DOM('.dataentrytable')[0].children.forEach(function(v,i,a){
			if(v.type=="text")
				return;
			v.children.forEach(function(v,i,a){
				if(v.type=="text")
					return;
				if(v.children[0].data==undefined)
					v.children[0].data=v.children[0].children[0].data;
				var newIndex = fields.indexOf(v.children[0].data.trim());
				if(newIndex>0){
					index=newIndex;
					return;
				}
				var childValue	=	v.children[0].data;
				switch(index){
						case 0:JSON.crn =   parseInt(childValue);break;
						case 1:
								var subjectArray    =   childValue.split(' ');
								JSON.code =   subjectArray[1]
								JSON.department	=	subjectArray[0];
								JSON.section =   subjectArray[2];
						break;
						case 2:JSON.name    =   childValue;break;
						case 3:JSON.credits =   childValue;break;
						case 4:JSON.type    =   childValue;break;
						case 5:JSON.campus  =   childValue;break;
						case 6:JSON.status  =   childValue;break;
				}
			});
		});
	return JSON;
}


function timesParse(DOM){
	var timeArray	=	[];
	if(DOM('.dataentrytable')[1]==undefined)
		return timeArray;
	
    DOM('.dataentrytable')[1].children.forEach(function(v,i,a){
			if(i==1||v.type=="text")
				return;
			var JSON	={
				startDate:'',
				endDate:'',
				days:[0],
				start:'',
				end:'',
				instructor:'',
				room:'',
				online:false,
				campus:''
			}
			if(v==undefined||v.children==undefined||v.children.length==1)
				return;
			v.children.forEach(function(v,i,a){
				if(v.type=="text")
					return;
				var data	=	v.children[0].data;
				
				switch(i){
				case 1:
					JSON.startDate	=	data.split(' to ')[0];
					JSON.endDate	=	data.split(' to ')[1];
				break;
				case 3:
					JSON.days	=	data.split(' ').map(function(day){
						return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(day);
					});
				break;
				case 5:
					JSON.start	=	toMin(data.split(' - ')[0]);
					JSON.end	=	toMin(data.split(' - ')[1]);
				break;
				case 7:
					JSON.campus	=	data;
					if(data=="Online")
						JSON.online=true;
				break;
				case 13:
					JSON.instructor	=	data;
				break;
				}
				
			});
			
			
			timeArray.push(JSON);
		});
	return timeArray;
}

function toMin(time){

	try{
			var time = time.split(':');
		}catch(e){
			return 0;
		}
	if(time[0].trim()=="")
			return 0;
		return parseInt(time[0])*60+parseInt(time[1])*1;
}










function main(){
		var crnCounter=0;
    var crnInt	=	setInterval(function(){
        _.get({
            url:COURSE_URL+CRN_ARRAY[crnCounter++],
            json:false,
            done:function(html){
								var document = cheerio.load(html);
								var courseInfo	=	parseCourseBasic(document);
								var times	=	timesParse(document);
								dbParser.pushData(courseInfo,times);
            }
        });
			if(crnCounter%100==0){
				console.log(crnCounter);
			}
			if(crnCounter==CRN_ARRAY.length){
				clearInterval(crnInt);
				dbParser.createInstant();
			}
    },300);
}













	function Mangler(course){
		var typeArray	=	[];
		var mangled	=	[];
		if(course.sectionTypes.length==1){
			return course.sections[course.sectionTypes[0]].map(a=>[a.uniq]);
		}
		for(var type in course.sections)
			typeArray.push(course.sections[type]);

		typeArray.sort((a,b)=>(b.length-a.length));
		typeArray[0].forEach(function(v,i,a){
			depther([v],1,typeArray);
		});
		mangled	=	mangled.map(	a => a.map(b => b.uniq));

		return mangled;

		//make sure to sort the layers by section length before doing this.
		function	depther(pos,layerIndex,layerArray){

			var layer	=	layerArray[layerIndex];
			if(layerIndex>layerArray.length||layer.length==0)
				return mangled.push(pos);

			var layerC	=	layer.length;
			up:
			while(layerC--){
				var sectionC	=	pos.length;
				while(sectionC--){

					var timeS	=	pos[sectionC].times.length;
					var timeL	=	layer[layerC].times.length;
					while(timeL--){
						while(timeS--){
							var pST	=	pos[sectionC].times[timeS];
							var lST	=	layer[layerC].times[timeL];
							if(TIME.sameDay(pST.days,lST.days)&&TIME.inTime(pST.start,pST.end,lST.start,lST.end))
								continue up;
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




































