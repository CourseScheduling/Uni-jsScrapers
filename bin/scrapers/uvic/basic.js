var exec = require('child_process'),
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
	lines.forEach(function(line,i,a){
		var lineArray	=	line.split('!');
		if(lineArray[0]==' '){
			
		}
		else{
			INFO.crn			=	lineArray[0];
			INFO.subject	=	lineArray[1];
			INFO.status		=	'Open';
			INFO.code			=	lineArray[2];
			INFO.section	=	lineArray[3];
			INFO.name			=	lineArray[5];
			INFO.credits	=	lineArray[4];
			INFO.campus		=	'UVic';
		}
		console.log(INFO);
	});
});