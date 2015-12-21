var exec = require('child_process'),
		dbParser	=	require('./dbParser'),
    cmd  = 'php scraper.php';

//CRN!Subject!Course!Section!Credits!Name!Days!Time!Capacity!Actual!Remaining!WLCapacity!WLActual!WLRemaining!XLCapacity!XLActual!XLRemaining!Instructor!Date!Room
// 0   1        2       3        4    5    6    7    8          9    10         11            12   13               14     15       16             17      18  19
var PHP_NEW_LINE	=	'\r\n';


exec.exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
	
	var INFO	=	{
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
	var TIME	=	{
		startDate:'',
		endDate:'',
		days:[''],
		startTime:'',
		endTime:'',
		instructor:''
	}
	var lines	=	stdout.split(PHP_NEW_LINE);
	var courses = [];
	var prevSection	=	{};
	
	lines.forEach(function(line,i,a){
		var lineArray	=	line.split('!');
		if(lineArray[0]==' '){
			prevSection['section'].push	
		}
		else{
			INFO.section	=	
			INFO.crn			=	lineArray[0];
			INFO.subject	=	lineArray[1];
			INFO.status		=	'Open';
			INFO.code			=	lineArray[2];
			INFO.section	=	lineArray[3];
			INFO.name			=	lineArray[5];
			INFO.credits	=	lineArray[4];
			INFO.campus		=	'UVic';
			INFO.days	=	lineArray[6].split('').map(function(a){return ['M','T','W','R','F','S'].indexOf(a)}).join('');
			INFO.startTime	=	parseTime(lineArray[7])[0];
			INFO.endTime	=	parseTime(lineArray[7])[1];
		}
		dbParser.pushData(INFO);
	});
});

function parseTime(time){
	console.log(time);
	if(time==' '||time=='TBA'){
		return ['',''];
	}else{
		var time = time.split(' - ');
		return [ampm(time[0]),ampm(time[1])];
	}
}

	function ampm(time){
		var hours = Number(time.match(/^(\d+)/)[1]);
		var minutes = Number(time.match(/:(\d+)/)[1]);
		var AMPM = time.match(/\s(.*)$/)[1];
		if(AMPM == "pm" && hours<12) hours = hours+12;
		if(AMPM == "am" && hours==12) hours = hours-12;
		var sHours = hours.toString();
		var sMinutes = minutes.toString();
		if(hours<10) sHours = "0" + sHours;
		if(minutes<10) sMinutes = "0" + sMinutes;
		return sHours + ":" + sMinutes;
	}