var _   =   require('../../../global');

var dbParser	=	require('./dbParser.js');
var fs  =   require('fs');
var cheerio = require('cheerio');
var sleep = require('sleep');
var YEAR	=	2016;
var TERM	=	"spring";

var pages	=	[];

_.get({
	url:'https://www.sfu.ca/bin/wcm/course-outlines?year='+YEAR+'&term='+TERM,
	json:true,
	done:function(data){
		var n = data.length-1;
		var s = setInterval(function(){
			var dptJSON	=	data[n--];
				_.get({
						url:'https://www.sfu.ca/bin/wcm/course-outlines?year='+YEAR+'&term='+TERM+'&dept='+dptJSON.value+'&showTitle=true',
						json:true,
						done:function(data){
							data.forEach(function(codeJSON){
								_.get({
									url:'https://www.sfu.ca/bin/wcm/course-outlines?year='+YEAR+'&term='+TERM+'&dept='+dptJSON.value+'&number='+codeJSON.value,
									json:true,
									done:function(data){
										data.forEach(function(sectionJSON){
												_.get({
													url:'https://www.sfu.ca/outlines.html?'+YEAR+'/'+TERM+'/'+dptJSON.value+'/'+codeJSON.value+'/'+sectionJSON.value,
													json:false,
													done:function(page){
														sleep.sleep(1);
														var JSON	={
															name:'',
															code:(dptJSON.value+codeJSON.value),
															section:'',
															classNumber:'',
															description:'',
															prereq:'',
															campus:'',
															term:TERM+' '+YEAR,
															times:[]
														}
														console.log(dptJSON.value+codeJSON.value+'/'+sectionJSON.value);
														var DOM	=	cheerio.load(page);
														if(DOM('.course-times')[0]!==undefined)
														DOM('.course-times')[0].children.forEach(function(v,i,a){
															if(v.name=='p'&&v.children.length>1){
																var TIMES	=	{
																	days:'',
																	startTime:0,
																	endTime:0,
																}
																var data	=	v.children[0].data;
																var days	=	data.split(' ').slice(0,data.split(' ').indexOf('–')-2).map(function(a){return ['Mo','Tu','We','Th','Fr','Sa'].indexOf(a.replace(/[^a-zA-Z]/g,''));}).join('');
																var time	=	data.split(' ').slice(data.split(' ').indexOf('–')-2).join('').split('–').map(function(a){return am24(a);});
																TIMES.days	=	days
																TIMES.startTime	=	time[0];
																TIMES.endTime	=	time[1];
																var data	=	v.children[2].data;
																JSON.campus	=	data.split(' ')[2];
																JSON.times.push(TIMES);
															}

														});	
														if(DOM('#title')[0]!==undefined){
															JSON.name	=	DOM('#title')[0].children[0].data.trim().split('\n')[0];
														}
														if(DOM('#class-number')[0]!==undefined){
															JSON.classNumber	=	DOM('#class-number')[0].children[0].data.trim().substr(14);
														}if(DOM('.prereq')[0]>0){
															JSON.prereq	= DOM('.prereq')[0].children[2].data.trim();
														}
														if(DOM('.ruled.ruledMargin')[1]!==undefined&&	DOM('.ruled.ruledMargin')[1].next.next.next.next.children[0]!==undefined)
															JSON.description	=	DOM('.ruled.ruledMargin')[1].next.next.next.next.children[0].data;
													dbParser.pushData(JSON);
													}
												});
										});
									}
								});
							});
						}
				});
			if(n==0){
				clearInterval(s);
				dbParser.createInstant();
			}
		},1000);
	}
});



/*
_.get({
	url:'https://www.sfu.ca/outlines.html?2016/spring/chem/111/d100',
	done:function(page){
		var DOM	=	cheerio.load(page);
		DOM('.course-times')[0].children.forEach(function(v,i,a){
			if(v.name=='p'){
				var data	=	v.children[0].data;
				var days	=	data.split(' ').slice(0,data.split(' ').indexOf('–')-2).map(function(a){return a.replace(/[^a-zA-Z]/g,'');});
				var time	=	data.split(' ').slice(data.split(' ').indexOf('–')-2).join('').split('–');
				console.log(days,time);
				var data	=	v.children[2].data;
				console.log(data.split(' ')[2]);
			}
			
		});	
		console.log(DOM('#title')[0].children[0].data.trim().split('\n')[0]);
		console.log(DOM('#class-number')[0].children[0].data.trim().substr(14));
		console.log(DOM('.prereq')[0].children[2].data.trim());
		console.log(DOM('.ruled.ruledMargin')[1].next.next.next.next.children[0].data);
		
	}
});
*/


function am24(a){
	var ampm	=	a.substr(-2);
	var time	=	a.slice(0,-2);
	if(ampm=="PM"&&time.substr(0,2)!=="12"){
		return toMin(time)+720;
	}else{
		return toMin(time);
	}
		
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