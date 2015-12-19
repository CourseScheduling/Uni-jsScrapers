
// Load all the libraries
var fs  =   require('fs');
var cheerio = require('cheerio');
var _   =   require('../../../global');

//require('nw.gui').Window.get().showDevTools() 
//Our daily reminder
var JosephIsAwesome =   true;
//Initialize constants
var SEMESTER    =   "Winter"; //Can be Summer, Winter or, Fall
var YEAR    =   "2016"; //Remember this is 1 year after the year you're in typing this.
var INTERACTIVE_SESSION  =   "322541";


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
        subject:"",
        status:"",
        code:"",
        section:"",
        name:"",
        credits:0.0,
        campus:"",
        type:"",
        status:""
    };
			var index = 0;
    DOM('.dataentrytable').get(0).children.forEach(function(v,i,a){
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
								JSON.subject =   subjectArray[0];
								JSON.code =   subjectArray[1];
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
	
}

function timesParse(DOM){
    
    [].forEach.call(DOM.getElementsByTagName('tbody')[3].children,function(v,i,a){
        /*
            How the system is set up
            Node
                Node - StartDate "to" EndDate
                Node - Days
                Node - startTime " - " endTime
                Node - Building
                Node - Room
                Node - Type
                Node - Instructor
                Node - Type
        */
        var DayArray    =   {
            Mon:0,
        }
        var JSON    =   {
            startDate:"",
            endDate:"",
            building:"",
            room:"",
            instructor:"",
            startTime:"",
            endTime:""
        }
        
        var childValue  = (function find(el){
            if(el.children.length<=0)
                return el.innerHTML.trim();
            else
                return find(el.firstChild);
        })(v.firstChild);
        var a = new Date(childValue.split(' to ')[0]);
        if(a=="Invalid Date")
            return;
        
        JSON.startDate  =   new Date(childValue.split(' to ')[0]);
        JSON.endDate    =   new Date(childValue.split(' to ')[1]);
         
        
    });
}

























function main(){
    setInterval(function(){
        _.get({
            url:COURSE_URL+CRN_ARRAY[parseInt(Math.random()*CRN_ARRAY.length)],
            json:false,
            done:function(html){
								var document = cheerio.load(html);
								parseCourseBasic(document);
            }
        });
    },3000);
}