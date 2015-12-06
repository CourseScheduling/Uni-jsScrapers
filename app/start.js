/*

    Why am I making this:
        After the first python script I realized that creating such complicated 
        data structure causes a lot of memory management errors..
        As a result this program must be as simple as possible and thoroughly 
        tested to ensure that there aren't any leaks.
        
        Keep It Simple
*/

/*

    Some General Stuff 
    
    We'll be taking crns from
        http://www.ufv.ca/arfiles/includes/201009-timetable-with-changes.htm
    and then the course data from
        https://warden.ufv.ca:8910/prod/bwysched.p_display_course?wsea_code=CRED&term_code=201101&session_id=320016&crn=10620
    
*/
    


//Our daily reminder
var JosephIsAwesome =   true;
//Initialize constants
var SEMESTER    =   "Winter"; //Can be Summer, Winter or, Fall
var YEAR    =   "2016"; //Remember this is 1 year after the year you're in typing this.
var INTERACIVE_SESSION  =   "320016";

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
    "session_id=",
    INTERACIVE_SESSION,
    "&crn="
].join('');

var CRN_ARRAY    =   [];



//Grab the crnData
$.get({
    url:CRN_URL,
    sync:true,
    done:function(data){
        //Remove all the html and create an array of every 5 digit number
        CRN_ARRAY   =   data.replace(/(<([^>]+)>)/ig,"").match(/(\d\d\d\d\d)/g);
        //Start the program!
        main();
    }
});



































function main(){
    
}